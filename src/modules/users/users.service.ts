import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private i18nService: I18nService,
    ) {}

    async getUserById(id: number): Promise<User | null> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('user not found');
        return user;
    }

    getUsers(page: number, limit: number): Promise<User[]> {
        return this.usersRepository.find({
            skip: (page - 1) * limit,
            take: limit,
        });
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
        Object.assign(user, attrs);
        return this.usersRepository.save(user);
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

    async getUsersFirebaseTokens(userIds: number[]): Promise<string[]> {
        const users = await this.usersRepository.find({
            where: { id: In(userIds) },
            select: ['firebaseToken'],
        });
        return (
            users
                .filter((user) => user.firebaseToken)
                .map((user) => user.firebaseToken) ?? []
        );
    }
}
