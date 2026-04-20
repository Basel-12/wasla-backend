import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Version,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { I18nLang, I18nService } from 'nestjs-i18n';
// import { Serialize } from 'src/common/interceptors/serailze.interceptor';
// import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private i18nService: I18nService,
    ) {}

    // @Serialize(UserDto)
    @HttpCode(HttpStatus.CREATED)
    @Post('/signup')
    @Version('1')
    async signup(@Body() newUser: CreateUserDto, @I18nLang() lang: string) {
        const user = await this.authService.signup(newUser, lang);
        return {
            success: true,
            message: this.i18nService.t('auth.USERREGISTERED'),
            data: user,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    @Version('1')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @I18nLang() lang: string,
    ) {
        const { access_token } = await this.authService.login(
            email,
            password,
            lang,
        );
        return {
            success: true,
            message: this.i18nService.t('auth.LOGINSUCCESSFUL'),
            data: access_token,
        };
    }

    // @Serialize(UserDto)
    @HttpCode(HttpStatus.OK)
    @Post('/verify-otp')
    @Version('1')
    verifyOtp(@Body('userId') userId: number, @Body('otp') otp: number) {
        return this.authService.verifyOtp(userId, otp);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/resend-otp')
    @Version('1')
    async resendOtp(@Body('userId') userId: number, @I18nLang() lang: string) {
        await this.authService.sendOtp(userId, 'resend', lang);
        return {
            success: true,
            message: this.i18nService.t('auth.OTPRESENT'),
        };
    }
}
