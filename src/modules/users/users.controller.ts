import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    Version,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersService } from './users.service';
import { SetUserFirebaseTokenDto } from './dto/set-user-token.dto';
import type { Request } from 'express';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}
    @Get('/me')
    @Version('1')
    getProfile() {
        return 'This is the user profile';
    }

    @Post('/set-firebase-token')
    @Version('1')
    async setFirebaseToken(
        @Body() setFirebaseTokenDto: SetUserFirebaseTokenDto,
        @Req() request: Request,
    ) {
        const user = await this.usersService.setUserFirebaseToken(
            request.user?.id as number,
            setFirebaseTokenDto.firebaseToken,
            setFirebaseTokenDto.deviceId,
        );
        return {
            success: true,
            message: 'Firebase token set successfully',
            data: user,
        };
    }
}
