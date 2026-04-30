import { Module } from '@nestjs/common';
import { NotificationQueueService } from './notification-queue.service';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationQueueProcessor } from './notification-queue.processor';

@Module({
    imports: [
        FirebaseModule,
        BullModule.registerQueue({
            name: 'notification-queue',
        }),
    ],
    providers: [NotificationQueueService, NotificationQueueProcessor],
    exports: [NotificationQueueService],
})
export class NotificationQueueModule {}
