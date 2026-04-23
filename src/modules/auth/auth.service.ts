import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { OtpService } from '../otp/otp.service';
import { MailQueueService } from '../queues/mail-queue/mail-queue.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService,
        private i18nService: I18nService,
        private otpService: OtpService,
        private mailQueueService: MailQueueService,
        private logger: Logger,
    ) {}

    async signup(newUser: CreateUserDto, lang: string) {
        const user = await this.usersService.userExists(newUser.email);
        if (user)
            throw new BadRequestException(
                this.i18nService.t('auth.USERALREADYEXISTS'),
            );

        const hashedPassword = await bcrypt.hash(newUser.password, 12);
        const createdUser = await this.usersService.addUser({
            ...newUser,
            password: hashedPassword,
        });

        // TODO: add email as a job to bullmq
        void this.sendOtp(createdUser.email, 'verify_email', lang).catch(
            (err) => this.logger.error(err),
        );
        return createdUser;
    }

    async login(email: string, password: string, lang: string) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user)
            throw new UnauthorizedException(
                this.i18nService.t('auth.INVALIDCREDENTIALS'),
            );

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect)
            throw new UnauthorizedException(
                this.i18nService.t('auth.INVALIDCREDENTIALS'),
            );

        if (!user.isVerified) {
            void this.sendOtp(user.email, 'verify_email', lang).catch((err) =>
                this.logger.error(err),
            );
            throw new ForbiddenException(
                this.i18nService.t('auth.USERNOTVERIFIED'),
            );
        }

        const payload = { id: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: this.config.get('JWT_EXPIRES_IN') || '1d',
            }),
        };
    }

    async sendOtp(email: string, reason: string, lang: string) {
        const otp = this.otpService.generateOtp(6);
        const otpString = otp.toString().padStart(6, '0').split('');
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            this.logger.error(`User ${email} not found`);
            throw new NotFoundException(
                this.i18nService.t('auth.USERNOTFOUND'),
            );
        }
        if (reason === 'reset_password' && !user.isVerified) {
            throw new BadRequestException(
                this.i18nService.t('auth.USERNOTVERIFIED'),
            );
        }
        const otpEntity = await this.otpService.createOtp(
            user.id,
            reason,
            otp,
            5,
        );
        this.logger.log(`Sending OTP to user ${email} for reason ${reason}`);
        await this.mailQueueService.addSendMailJob({
            to: user?.email || '',
            subject: reason.replace('_', ' ').toUpperCase(),
            template: 'otp',
            context: {
                name: user.name,
                otp: otp,
                minutes: Math.ceil(
                    (new Date(otpEntity.expiresAt).getTime() - Date.now()) /
                        60000,
                ),
                d1: otpString[0],
                d2: otpString[1],
                d3: otpString[2],
                d4: otpString[3],
                d5: otpString[4],
                d6: otpString[5],
            },
            locale: lang,
        });
        return otp;
    }

    async verifyOtp(email: string, otp: number, reason?: string) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            this.logger.error(`User ${email} not found`);
            throw new NotFoundException(
                this.i18nService.t('auth.USERNOTFOUND'),
            );
        }
        const existingOtp = await this.otpService.verifyOtp(
            user.id,
            otp,
            reason,
        );
        if (existingOtp.expiresAt < new Date())
            throw new BadRequestException(
                this.i18nService.t('auth.OTP_EXPIRED'),
            );
        return this.usersService.updateUser(user.id, { isVerified: true });
    }

    async verifyResetOtp(email: string, otp: number) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            this.logger.error(`User ${email} not found`);
            throw new NotFoundException(
                this.i18nService.t('auth.USERNOTFOUND'),
            );
        }
        await this.otpService.verifyOtp(user.id, otp, 'reset_password');

        //generate reset token
        const resetToken = this.jwtService.sign(
            { id: user.id, email: user.email, role: user.role },
            {
                expiresIn: this.config.get('RESET_TOKEN_EXPIRES_IN') || '10m',
                secret: this.config.get('RESET_TOKEN_SECRET'),
            },
        );
        return resetToken;
    }

    async resetPassword(password: string, resetToken: string) {
        try {
            const decoded = this.jwtService.verify<{
                id: number;
                email: string;
                role: string;
            }>(resetToken, {
                secret: this.config.get('RESET_TOKEN_SECRET'),
            });

            const user = await this.usersService.getUserByEmail(decoded.email);
            if (!user) {
                throw new NotFoundException(
                    this.i18nService.t('auth.USERNOTFOUND'),
                );
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            await this.usersService.updateUser(user.id, {
                password: hashedPassword,
            });
            return this.i18nService.t('auth.PASSWORDRESET');
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException(
                this.i18nService.t('auth.INVALIDRESETTOKEN'),
            );
        }
    }
}
