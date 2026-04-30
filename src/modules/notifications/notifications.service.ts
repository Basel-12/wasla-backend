import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { UserNotification } from './entities/user.notifications.entity';
import { NotificationQueueService } from '../queues/notification-queue/notification-queue.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        @InjectRepository(UserNotification)
        private userNotificationRepository: Repository<UserNotification>,
        private notificationQueueService: NotificationQueueService,
        private usersService: UsersService,
    ) {}

    //notifications methods

    async getAllNotifications(): Promise<Notification[]> {
        return this.notificationRepository.find();
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
        notification: Notification,
    ): Promise<Notification> {
        const newNotification =
            this.notificationRepository.create(notification);
        return this.notificationRepository.save(newNotification);
    }

    async updateNotification(
        notification: Notification,
    ): Promise<Notification> {
        return this.notificationRepository.save(notification);
    }

    async deleteNotification(id: number): Promise<void> {
        await this.notificationRepository.delete(id);
    }

    //user notifications methods

    async getAllusersNotifications(): Promise<UserNotification[]> {
        return this.userNotificationRepository.find();
    }

    async getAllUserNotifications(userId: number): Promise<UserNotification[]> {
        return this.userNotificationRepository.find({
            where: { user: { id: userId } },
            relations: ['notification'],
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async getLastFiveUserNotifications(
        userId: number,
    ): Promise<UserNotification[]> {
        return this.userNotificationRepository.find({
            where: { user: { id: userId } },
            relations: ['notification'],
            order: {
                createdAt: 'DESC',
            },
            take: 5,
        });
    }

    async notifyUser(userId: number, notificationId: number) {
        const userNotification = this.userNotificationRepository.create({
            user: { id: userId },
            notification: { id: notificationId },
        });
        return this.userNotificationRepository.save(userNotification);
    }
}
