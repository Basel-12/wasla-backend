import { MailerService } from '@nestjs-modules/mailer';
import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        private readonly logger: Logger,
    ) {}

    async sendEmail(
        to: string,
        subject: string,
        template: string,
        context: Record<string, any>,
        locale?: string,
    ) {
        try {
            await this.mailerService.sendMail({
                to,
                subject,
                from: this.configService.get('MAIL_FROM'),
                template: `${locale || 'ar'}/${template}`,
                context: context,
            });
        } catch (err) {
            //Log the error
            this.logger.error(err);
            throw new InternalServerErrorException('Failed to send email');
        }
    }
}
