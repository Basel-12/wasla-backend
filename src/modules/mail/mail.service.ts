import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
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
                template: template,
                context: context,
                locale: locale || 'ar',
            });
        } catch (err) {
            //Log the error
            throw new InternalServerErrorException('Failed to send email');
        }
    }
}
