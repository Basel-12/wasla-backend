import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class JobsService {
    constructor(
        private usersService: UsersService,
        private notificationsService: NotificationsService,
        private Logger: Logger,
    ) {}

    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleUserVerification() {
        this.Logger.log('Sending Welcome Notification to newly verified users');
        const users =
            await this.usersService.getVerifiedUsersWithoutWelcomeNotification();
        if (users.length > 0) {
            await this.notificationsService.notifyUsers(
                users.map((user) => user.id),
                1,
            );
            this.Logger.log(
                `Welcome Notification sent to ${users.length} newly verified users`,
            );
        } else {
            this.Logger.log('No newly verified users found');
        }
    }
}
