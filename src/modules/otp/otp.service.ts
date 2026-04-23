import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp) private otpRepository: Repository<Otp>,
        private i18nService: I18nService,
    ) {}

    generateOtp(length: number) {
        return Math.floor(
            10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1),
        );
    }

    createOtp(
        userId: number,
        reason: string,
        otp: number,
        expiresIn: number,
    ): Promise<Otp> {
        const expiresAt = new Date(Date.now() + expiresIn * 60 * 1000);
        const newOtp = this.otpRepository.create({
            reason,
            otp: otp.toString(),
            expiresAt,
            user: { id: userId },
        });
        return this.otpRepository.save(newOtp);
    }

    async verifyOtp(userId: number, otp: number, reason?: string) {
        const existingOtp = await this.otpRepository.findOne({
            where: {
                user: { id: userId },
                otp: otp.toString(),
                reason: reason ? reason : undefined,
            },
            order: {
                id: 'DESC',
            },
        });
        if (!existingOtp)
            throw new BadRequestException(
                this.i18nService.t('auth.INVALIDOTP'),
            );
        if (existingOtp.expiresAt < new Date())
            throw new BadRequestException(
                this.i18nService.t('auth.OTP_EXPIRED'),
            );
        return existingOtp;
    }
}
