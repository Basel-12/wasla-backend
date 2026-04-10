import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MailQueueService {
    constructor(@InjectQueue('mail-queue') private readonly mailQueue: Queue) {}

    async addSendMailJob(data: {
        to: string;
        subject: string;
        template: string;
        context: Record<string, any>;
        locale?: string;
    }) {
        await this.mailQueue.add('send-mail', data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true,
        });
    }
}
