import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNotification } from './entities/user.notifications.entity';
import { Notification } from './entities/notification.entity';
import { NotificationQueueModule } from '../queues/notification-queue/notification-queue.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, UserNotification]),
        NotificationQueueModule,
        UsersModule,
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService],
})
export class NotificationsModule {}
