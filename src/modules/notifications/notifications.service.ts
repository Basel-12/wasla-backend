import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { UserNotification } from './entities/user.notifications.entity';
import { NotificationQueueService } from '../queues/notification-queue/notification-queue.service';
import { UsersService } from '../users/users.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CreateUserNotificationsDto } from './dto/create-user-notifications.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedMeta } from 'src/common/types/paginated-meta';
import { PaginatedResult } from 'src/common/types/paginated-result';
import { Language } from '../users/entities/user.entity';
import { Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        @InjectRepository(UserNotification)
        private userNotificationRepository: Repository<UserNotification>,
        private notificationQueueService: NotificationQueueService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
    ) {}

    //notifications methods

    async getAllNotifications(
        dto: PaginationDto,
    ): Promise<PaginatedResult<Notification>> {
        const [rows, total] = await this.notificationRepository.findAndCount({
            skip: dto.skip,
            take: dto.limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data: rows,
            meta: {
                total,
                page: dto.page,
                limit: dto.limit,
                totalPages: Math.ceil(total / dto.limit),
            },
        };
    }

    async getNotificationById(id: number): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({
            where: { id },
        });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        return notification;
    }

    async createNotification(
        notification: CreateNotificationDto,
    ): Promise<Notification> {
        const newNotification =
            this.notificationRepository.create(notification);
        return this.notificationRepository.save(newNotification);
    }

    async updateNotification(
        id: number,
        updateNotificationDto: UpdateNotificationDto,
    ): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({
            where: { id },
        });
        if (!notification) {
            throw new NotFoundException('Notification not found');
        }
        Object.assign(notification, updateNotificationDto);
        return this.notificationRepository.save(notification);
    }

    async deleteNotification(id: number): Promise<void> {
        await this.notificationRepository.delete(id);
    }

    //user notifications methods

    async getAllusersNotifications(
        dto: PaginationDto,
    ): Promise<PaginatedResult<UserNotification>> {
        const [rows, total] =
            await this.userNotificationRepository.findAndCount({
                skip: dto.skip,
                take: dto.limit,
                relations: ['notification'],
                order: { createdAt: 'DESC' },
            });
        return {
            data: rows,
            meta: {
                total,
                page: dto.page,
                limit: dto.limit,
                totalPages: Math.ceil(total / dto.limit),
            },
        };
    }

    async getAllUserNotifications(
        userId: number,
        lang: string = 'ar',
        query: PaginationDto,
    ): Promise<{
        data: UserNotification[];
        meta: PaginatedMeta;
    }> {
        const [rows, total] =
            await this.userNotificationRepository.findAndCount({
                where: { user: { id: userId } },
                relations: ['notification'],
                order: { createdAt: 'DESC' },
                skip: query.skip,
                take: query.limit,
            });
        const data = rows.map((row) => ({
            ...row,
            notification: {
                ...row.notification,
                title:
                    row.notification.title_translations?.[lang] ??
                    row.notification.title,
                body:
                    row.notification.body_translations?.[lang] ??
                    row.notification.body,
            },
        }));
        const meta = {
            total,
            page: query.page,
            limit: query.limit,
            totalPages: Math.ceil(total / query.limit),
        };
        return { data, meta };
    }

    async getLastFiveUserNotifications(
        userId: number,
        lang: string = 'ar',
    ): Promise<UserNotification[]> {
        const rows = await this.userNotificationRepository.find({
            where: { user: { id: userId } },
            relations: ['notification'],
            order: { createdAt: 'DESC' },
            take: 5,
        });
        return rows.map((row) => ({
            ...row,
            notification: {
                ...row.notification,
                title:
                    row.notification.title_translations?.[lang] ??
                    row.notification.title,
                body:
                    row.notification.body_translations?.[lang] ??
                    row.notification.body,
            },
        }));
    }

    async createUserNotification(
        createUserNotificationsDto: CreateUserNotificationsDto,
    ) {
        const userNotification = this.userNotificationRepository.create({
            user: { id: createUserNotificationsDto.userId },
            notification: { id: createUserNotificationsDto.notificationId },
        });
        return this.userNotificationRepository.save(userNotification);
    }

    async markAsRead(userId: number, notificationId: number) {
        const userNotification = await this.userNotificationRepository.findOne({
            where: {
                user: { id: userId },
                id: notificationId,
            },
        });
        if (!userNotification) {
            throw new NotFoundException('User notification not found');
        }
        userNotification.isRead = true;
        userNotification.readAt = new Date();
        return this.userNotificationRepository.save(userNotification);
    }

    async notifyUser(userId: number, notificationId: number) {
        const user = await this.usersService.getUserById(userId);

        const lang = user?.preferredLanguage ?? Language.AR;

        const notification = await this.getNotificationById(notificationId);

        const userNotification = await this.createUserNotification({
            userId,
            notificationId,
        });
        if (!user?.firebaseToken) {
            return userNotification;
        }
        await this.notificationQueueService.addSendOneNotificationJob({
            fcmToken: user?.firebaseToken ?? '',
            title:
                notification.title_translations?.[lang] || notification.title,
            body: notification.body_translations?.[lang] || notification.body,
            data: notification.data ?? undefined,
        });
        return userNotification;
    }

    async notifyUsers(userIds: number[], notificationId: number) {
        const rows = userIds.map((userId) =>
            this.userNotificationRepository.create({
                user: { id: userId },
                notification: { id: notificationId },
            }),
        );
        const notification = await this.getNotificationById(notificationId);
        const userNotifications =
            await this.userNotificationRepository.save(rows);
        const tokens = await this.usersService.getUsersFirebaseTokens(userIds);
        if (!tokens.length) {
            return userNotifications;
        }

        const grouped = tokens.reduce(
            (acc, token) => {
                const lang = token.lang ?? Language.AR;
                if (!acc[lang]) acc[lang] = [];
                acc[lang].push(token.fcmToken);
                return acc;
            },
            {} as Record<string, string[]>,
        );

        await Promise.all(
            Object.entries(grouped).map(([lang, fcmTokens]) =>
                this.notificationQueueService.addSendMultipleNotificationJob({
                    fcmTokens,
                    title:
                        notification.title_translations?.[lang] ??
                        notification.title,
                    body:
                        notification.body_translations?.[lang] ??
                        notification.body,
                    data: notification.data ?? undefined,
                }),
            ),
        );
        return userNotifications;
    }
}
