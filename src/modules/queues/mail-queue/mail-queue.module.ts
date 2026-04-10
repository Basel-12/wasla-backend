import { Module } from '@nestjs/common';
import { MailQueueService } from './mail-queue.service';
import { MailModule } from 'src/modules/mail/mail.module';
import { BullModule } from '@nestjs/bullmq';
import { MailQueueProcessor } from './mail-queue.processor';

@Module({
    imports: [
        MailModule,
        BullModule.registerQueue({
            name: 'mail-queue',
        }),
    ],
    providers: [MailQueueService, MailQueueProcessor],
    exports: [MailQueueService],
})
export class MailQueueModule {}
