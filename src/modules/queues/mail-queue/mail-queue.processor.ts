import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from 'src/modules/mail/mail.service';

@Injectable()
@Processor('mail-queue')
export class MailQueueProcessor extends WorkerHost {
    constructor(private readonly mailService: MailService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        switch (job.name) {
            case 'send-mail': {
                const { to, subject, template, context, locale } = job.data as {
                    to: string;
                    subject: string;
                    template: string;
                    context: Record<string, any>;
                    locale?: string;
                };
                await this.mailService.sendEmail(
                    to,
                    subject,
                    template,
                    context,
                    locale,
                );
                break;
            }
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }

    @OnWorkerEvent('active')
    onActive(job: Job) {
        console.log(`Job ${job.id} is active`);
    }

    @OnWorkerEvent('failed')
    onFailed(job: Job, error: Error) {
        console.log(`Job ${job.id} is failed: ${error.message}`);
    }

    @OnWorkerEvent('stalled')
    onStalled(job: Job) {
        console.log(`Job ${job.id} is stalled`);
    }

    @OnWorkerEvent('error')
    onError(job: Job, error: Error) {
        console.log(`Job ${job.id} is errored: ${error.message}`);
    }

    @OnWorkerEvent('completed')
    onCompleted(job: Job) {
        console.log(`Job ${job.id} is completed`);
    }
}
