import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService,
        private i18nService: I18nService,
    ) {}

    async signup(newUser: CreateUserDto) {
        const user = await this.usersService.getUserByEmail(newUser.email);
        if (user)
            throw new BadRequestException(
                this.i18nService.t('auth.USERALREADYEXISTS'),
            );

        const hashedPassword = await bcrypt.hash(newUser.password, 12);
        return this.usersService.addUser({
            ...newUser,
            password: hashedPassword,
        });
    }

    async login(email: string, password: string) {
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

        const payload = { id: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: this.config.get('JWT_EXPIRES_IN') || '1d',
            }),
        };
    }
}
