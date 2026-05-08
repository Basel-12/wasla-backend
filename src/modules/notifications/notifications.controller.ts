import {
    Body,
    Controller,
    Param,
    Get,
    Post,
    Version,
    Patch,
    Delete,
    Req,
    UnauthorizedException,
    UseGuards,
    Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateUserNotificationsDto } from './dto/create-user-notifications.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { I18nLang } from 'nestjs-i18n';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import type { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/types/paginated-result';
import { UserNotification } from './entities/user.notifications.entity';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    /**
     *
     * notification routes
     */

    @Post('/create-notification')
    @Version('1')
    async createNotification(
        @Body() createNotificationDto: CreateNotificationDto,
    ) {
        const notification = await this.notificationsService.createNotification(
            createNotificationDto,
        );
        return {
            success: true,
            message: 'Notification created successfully',
            data: notification,
        };
    }

    @Get('/get-notification/:id')
    @Version('1')
    async getNotification(@Param('id') id: string) {
        const notification =
            await this.notificationsService.getNotificationById(Number(id));
        return {
            success: true,
            message: 'Notification fetched successfully',
            data: notification,
        };
    }

    @Get('/get-all-notifications')
    @Version('1')
    async getAllNotifications(@Query() dto: PaginationDto) {
        const notifications =
            await this.notificationsService.getAllNotifications(dto);
        const paginatedResult: PaginatedResult<Notification> = {
            data: notifications.data,
            meta: notifications.meta,
        };
        return {
            success: true,
            message: 'All notifications fetched successfully',
            data: paginatedResult,
        };
    }

    @Patch('/update-notification/:id')
    @Version('1')
    async updateNotification(
        @Param('id') id: string,
        @Body() updateNotificationDto: UpdateNotificationDto,
    ) {
        const notification = await this.notificationsService.updateNotification(
            Number(id),
            updateNotificationDto,
        );
        return {
            success: true,
            message: 'Notification updated successfully',
            data: notification,
        };
    }

    @Delete('/delete-notification/:id')
    @Version('1')
    async deleteNotification(@Param('id') id: string) {
        await this.notificationsService.deleteNotification(Number(id));
        return {
            success: true,
            message: 'Notification deleted successfully',
        };
    }

    /**
     *
     * user notification routes
     *
     *
     */

    @Get('/get-users-notifications')
    @Version('1')
    async getAllUsersNotifications(@Query() dto: PaginationDto) {
        const userNotifications =
            await this.notificationsService.getAllusersNotifications(dto);
        const paginatedResult: PaginatedResult<UserNotification> = {
            data: userNotifications.data,
            meta: userNotifications.meta,
        };
        return {
            success: true,
            message: 'All user notifications fetched successfully',
            data: paginatedResult,
        };
    }

    @Get('/get-user-notifications')
    @Version('1')
    @UseGuards(AuthGuard)
    async getUserNotifications(
        @Req() req: Request,
        @I18nLang() lang: string,
        @Query() dto: PaginationDto,
    ) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found');
        }
        const userNotifications =
            await this.notificationsService.getAllUserNotifications(
                Number(userId),
                lang,
                dto,
            );
        const paginatedResult: PaginatedResult<UserNotification> = {
            data: userNotifications.data,
            meta: userNotifications.meta,
        };
        return {
            success: true,
            message: 'User notifications fetched successfully',
            data: paginatedResult,
        };
    }

    @Get('/get-last-five-user-notifications')
    @Version('1')
    @UseGuards(AuthGuard)
    async getLastFiveUserNotifications(
        @Req() req: Request,
        @I18nLang() lang: string,
    ) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found');
        }
        const userNotifications =
            await this.notificationsService.getLastFiveUserNotifications(
                Number(userId),
                lang,
            );
        return {
            success: true,
            message: 'Last five user notifications fetched successfully',
            data: userNotifications,
        };
    }

    @Patch('/mark-as-read/:notificationId')
    @Version('1')
    @UseGuards(AuthGuard)
    async markAsRead(
        @Req() req: Request,
        @Param('notificationId') notificationId: string,
    ) {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException('User not found');
        }
        await this.notificationsService.markAsRead(
            Number(userId),
            Number(notificationId),
        );
        return {
            success: true,
            message: 'User notification marked as read successfully',
        };
    }

    @Post('/notify-user')
    @Version('1')
    async notifyUser(
        @Body() createUserNotificationsDto: CreateUserNotificationsDto,
    ) {
        const userNotification = await this.notificationsService.notifyUser(
            createUserNotificationsDto.userId,
            createUserNotificationsDto.notificationId,
        );
        return {
            success: true,
            message: 'User notification created successfully',
            data: userNotification,
        };
    }

    @Post('/notify-users')
    @Version('1')
    async notifyUsers(
        @Body() body: { userIds: number[]; notificationId: number },
    ) {
        const userNotifications = await this.notificationsService.notifyUsers(
            body.userIds,
            body.notificationId,
        );
        return {
            success: true,
            message: 'Users notifications created successfully',
            data: userNotifications,
        };
    }
}
