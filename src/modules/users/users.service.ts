import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) {}

    getUsers(page: number, limit: number): Promise<Users[]> {
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

    async updateUser(id: number, attrs: Partial<Users>) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        Object.assign(user, attrs);
        return this.usersRepository.save(user);
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
}
