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
import { I18nService } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private i18nService: I18nService,
    ) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('/signup')
    @Version('1')
    async signup(@Body() newUser: CreateUserDto) {
        const user = await this.authService.signup(newUser);
        return {
            succes: true,
            message: this.i18nService.t('auth.USERREGISTERED'),
            data: user,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    @Version('1')
    async login(
        @Body('phone') phone: string,
        @Body('password') password: string,
    ) {
        const { access_token } = await this.authService.login(phone, password);
        return {
            succes: true,
            message: this.i18nService.t('auth.LOGINSUCCESSFUL'),
            data: access_token,
        };
    }
}
