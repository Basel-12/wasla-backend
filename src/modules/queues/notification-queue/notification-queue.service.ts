import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationQueueService {
    constructor(
        @InjectQueue('notification-queue')
        private readonly notificationQueue: Queue,
    ) {}

    async addSendOneNotificationJob(data: {
        fcmToken: string;
        title: string;
        body: string;
        data?: Record<string, any>;
    }) {
        await this.notificationQueue.add('send-one-notification', data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true,
        });
    }

    async addSendMultipleNotificationJob(data: {
        fcmTokens: string[];
        title: string;
        body: string;
        data?: Record<string, any>;
    }) {
        await this.notificationQueue.add('send-multiple-notification', data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true,
        });
    }
}
