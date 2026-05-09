import {
    Body,
    Controller,
    Get,
    HttpCode,
    Patch,
    Post,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Version,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersService } from './users.service';
import { SetUserFirebaseTokenDto } from './dto/set-user-token.dto';
import type { Request } from 'express';
import { Serialize } from 'src/common/interceptors/serailze.interceptor';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { I18nService } from 'nestjs-i18n';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { User, UserRole } from './entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/types/paginated-result';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private i18nService: I18nService,
    ) {}

    // admin routes

    @Get('/all')
    @Version('1')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async getAllUsers(@Query() dto: PaginationDto) {
        const users = await this.usersService.getAllUsers(dto);
        const paginatedResult: PaginatedResult<User> = {
            data: users.data,
            meta: users.meta,
        };
        return {
            success: true,
            message: 'All users fetched successfully',
            data: paginatedResult,
        };
    }

    @Get('/me')
    @Version('1')
    @Serialize(UserDto)
    getProfile(@Req() request: Request) {
        const user = this.usersService.getUserById(request.user?.id as number);
        return user;
    }

    @Patch('/update-profile')
    @Version('1')
    @Serialize(UserDto)
    async updateProfile(
        @Body() updateUserDto: UpdateUserDto,
        @Req() request: Request,
    ) {
        const user = await this.usersService.updateUser(
            request.user?.id as number,
            updateUserDto,
        );
        return user;
    }

    @Patch('/change-password')
    @Version('1')
    async updatePassword(
        @Body() updatePasswordDto: UpdatePasswordDto,
        @Req() request: Request,
    ) {
        await this.usersService.updatePassword(
            request.user?.id as number,
            updatePasswordDto.oldPassword,
            updatePasswordDto.newPassword,
        );
        return {
            success: true,
            message: this.i18nService.t('user.PASSWORDUPDATEDSUCCESSFULLY'),
        };
    }

    @Patch('/update-avatar')
    @Version('1')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('avatar'))
    async updateAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Req() request: Request,
    ) {
        await this.usersService.updateAvatar(request.user?.id as number, file);
        return {
            success: true,
            message: this.i18nService.t('user.AVATARUPDATEDSUCCESSFULLY'),
            data: file.filename,
        };
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

    @Patch('/deactivate-user')
    @Version('1')
    @HttpCode(200)
    @Serialize(UserDto)
    async deactivateUser(@Req() request: Request) {
        await this.usersService.deactivateUser(request.user?.id as number);
        return {
            success: true,
            message: this.i18nService.t('user.USERDEACTIVATEDSUCCESSFULLY'),
        };
    }
}
