import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { I18nService } from 'nestjs-i18n';
import path from 'path';
import fs from 'fs/promises';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/types/paginated-result';
import { NotificationsService } from '../notifications/notifications.service';
import { Inject, forwardRef } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private i18nService: I18nService,
        private logger: Logger,
        @Inject(forwardRef(() => NotificationsService))
        private notificationsService: NotificationsService,
    ) {}

    async getUserById(id: number): Promise<User | null> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('user not found');
        return user;
    }

    async getAllUsers(dto: PaginationDto): Promise<PaginatedResult<User>> {
        const [users, total] = await this.usersRepository.findAndCount({
            skip: dto.skip,
            take: dto.limit,
        });
        return {
            data: users,
            meta: {
                total,
                page: dto.page,
                limit: dto.limit,
                totalPages: Math.ceil(total / dto.limit),
            },
        };
    }

    getUserByPhone(phone: string) {
        return this.usersRepository.findOne({ where: { phone } });
    }

    getUserByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    addUser(user: CreateUserDto) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    async updateUser(id: number, attrs: Partial<User>) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isWasVerified = user.isVerified === true;
        Object.assign(user, attrs);
        const updatedUser = await this.usersRepository.save(user);

        if (!isWasVerified && updatedUser.isVerified) {
            await this.notificationsService.notifyUser(updatedUser.id, 1);
        }
        return updatedUser;
    }

    async userExists(email: string) {
        const user = await this.usersRepository.findOne({
            where: { email },
        });
        return user ? true : false;
    }
    async deleteUser(id: number) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.deletedAt = new Date();
        user.isActive = false;
        return this.usersRepository.save(user);
    }

    async setUserFirebaseToken(
        id: number,
        firebaseToken: string,
        deviceId: string,
    ) {
        const user = await this.getUserById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.firebaseToken = firebaseToken;
        user.deviceId = deviceId;
        return this.usersRepository.save(user);
    }

    async getUsersFirebaseTokens(
        userIds: number[],
    ): Promise<{ fcmToken: string; lang: string }[]> {
        const users = await this.usersRepository.find({
            where: { id: In(userIds) },
            select: ['firebaseToken', 'preferredLanguage'],
        });
        return (
            users
                .filter((user) => user.firebaseToken)
                .map((user) => ({
                    fcmToken: user.firebaseToken,
                    lang: user.preferredLanguage,
                })) ?? []
        );
    }

    async updateAvatar(id: number, file: Express.Multer.File) {
        const user = await this.getUserById(id);

        //delete the old avatar

        try {
            const oldAvatar = user?.avatar;

            if (oldAvatar && oldAvatar !== 'avatar.png') {
                const oldAvatarPath = path.join(
                    process.cwd(),
                    'public',
                    'uploads',
                    'avatars',
                    oldAvatar,
                );

                await fs.unlink(oldAvatarPath);

                user.avatar = file.filename;
                return this.usersRepository.save(user);
            }
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException(
                this.i18nService.t('InternalServerError'),
            );
        }
    }

    async updatePassword(id: number, oldPassword: string, newPassword: string) {
        const user = await this.getUserById(id);

        const isOldPasswordCorrect = await bcrypt.compare(
            oldPassword,
            user?.password ?? '',
        );

        if (!isOldPasswordCorrect) {
            throw new BadRequestException(
                this.i18nService.t('user.INVALIDOLDPASSWORD'),
            );
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        user!.password = hashedNewPassword;
        return this.usersRepository.save(user!);
    }

    async deactivateUser(id: number) {
        const user = await this.getUserById(id);
        user!.isActive = false;
        user!.deletedAt = new Date();
        return this.usersRepository.save(user!);
    }

    async activateUser(id: number) {
        const user = await this.getUserById(id);
        user!.isActive = true;
        user!.deletedAt = null;
        return this.usersRepository.save(user!);
    }
}
