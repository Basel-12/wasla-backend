import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { FirebaseService } from 'src/modules/firebase/firebase.service';

@Injectable()
@Processor('notification-queue')
export class NotificationQueueProcessor extends WorkerHost {
    constructor(private readonly firebaseService: FirebaseService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case 'send-one-notification': {
                const { fcmToken, title, body, data } = job.data as {
                    fcmToken: string;
                    title: string;
                    body: string;
                    data: Record<string, any>;
                };
                await this.firebaseService.sendToOne(
                    fcmToken,
                    title,
                    body,
                    data,
                );
                break;
            }
            case 'send-multiple-notification': {
                const { fcmTokens, title, body, data } = job.data as {
                    fcmTokens: string[];
                    title: string;
                    body: string;
                    data: Record<string, any>;
                };
                await this.firebaseService.sendToMultiple(
                    fcmTokens,
                    title,
                    body,
                    data,
                );
                break;
            }
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }
}
