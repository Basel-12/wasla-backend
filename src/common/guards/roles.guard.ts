import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

interface AuthenticatedUser extends JwtPayload {
    id: number;
    role: UserRole;
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private i18nService: I18nService,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles || requiredRoles.length === 0) return true;

        const request: Request = context.switchToHttp().getRequest();
        const user = request.user as AuthenticatedUser | undefined;

        console.log('requiredRoles:', requiredRoles);
        console.log('user:', user);

        if (!user)
            throw new UnauthorizedException(
                this.i18nService.t('auth.INVALIDTOKEN'),
            );

        if (!requiredRoles.includes(user.role))
            throw new ForbiddenException(
                this.i18nService.t('auth.UNAUTHORIZED'),
            );

        return true;
    }
}
