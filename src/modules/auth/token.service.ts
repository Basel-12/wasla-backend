import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt.paylpad';

@Injectable()
export class TokenService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    generateAccessToken(payload: JwtPayload) {
        return this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1d',
        });
    }

    generateRefreshToken(payload: JwtPayload) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            expiresIn:
                this.configService.get('REFRESH_TOKEN_EXPIRES_IN') || '7d',
        });
    }

    verifyRefreshToken(token: string) {
        return this.jwtService.verify<JwtPayload>(token, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET') || '',
        });
    }

    createTokenPair(payload: JwtPayload) {
        return {
            access_token: this.generateAccessToken(payload),
            refresh_token: this.generateRefreshToken(payload),
        };
    }
}
