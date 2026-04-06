import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'jsonwebtoken';
import { I18nService } from 'nestjs-i18n';

interface AuthenticatedUser extends JwtPayload {
    id: number;
    phone: string;
    role: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthenticatedUser;
    }
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private i18nService: I18nService,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const secret = this.configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new InternalServerErrorException('Server Error');
            return false;
        }

        const authorization = request.header('authorization');
        const token = (authorization && authorization.split(' ')[1]) || '';

        if (!token)
            throw new UnauthorizedException(
                this.i18nService.t('auth.INVALIDTOKEN'),
            );

        try {
            const decoded = this.jwtService.verify<AuthenticatedUser>(token, {
                secret,
            });

            if (!decoded) return false;

            request.user = decoded;
            return true;
        } catch {
            throw new UnauthorizedException(
                this.i18nService.t('auth.INVALIDTOKEN'),
            );
        }
    }
}
