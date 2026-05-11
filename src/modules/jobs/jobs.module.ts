import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [UsersModule, NotificationsModule],
    providers: [JobsService],
})
export class JobsModule {}
