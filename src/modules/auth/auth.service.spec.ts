import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;
    const users: User[] = [];

    beforeEach(async () => {
        fakeUsersService = {
            getUserByPhone: async (phone: string) => {
                return Promise.resolve(
                    users.find((user) => user.phone === phone) || null,
                );
            },
            addUser: async (user: CreateUserDto) => {
                const newUser = {
                    id: Math.floor(Math.random() * 1000000),
                    ...user,
                } as User;
                users.push(newUser);
                return Promise.resolve(newUser);
            },
            getUserByEmail: async (email: string) => {
                return Promise.resolve(
                    users.find((user) => user.email === email) || null,
                );
            },
        };
        const fakeJwtService: Partial<JwtService> = {
            sign: jest.fn(() => 'test-token'),
            // verify: jest.fn(() => ({ id: 1, role: 'user' })),
        };
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService,
                },
                {
                    provide: JwtService,
                    useValue: fakeJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            const config = {
                                JWT_SECRET: 'test-secret',
                                JWT_EXPIRATION: '1h',
                            };
                            return config[key as keyof typeof config];
                        }),
                    },
                },
                {
                    provide: I18nService,
                    useValue: {
                        t: jest.fn((key: string) => Promise.resolve(key)),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should signup successfully', async () => {
        const newUser = {
            name: 'test',
            phone: '1234567890',
            email: 'test3@test.com',
            password: 'test',
        };
        const user = await service.signup(newUser);
        expect(user).toBeDefined();
        expect(user.email).toBe(newUser.email);
    });

    it('should throw error if user already exists', async () => {
        const newUser = {
            name: 'test',
            phone: '1234567890',
            email: 'test@test.com',
            password: 'test',
        };
        await service.signup(newUser);
        await expect(service.signup(newUser)).rejects.toThrow(
            BadRequestException,
        );
    });

    it('should check if password is hashed', async () => {
        const newUser = {
            name: 'test',
            phone: '1234567890',
            email: 'test2@test.com',
            password: 'test',
        };
        const user = await service.signup(newUser);
        expect(user.password).not.toBe(newUser.password);
    });

    it('should login successfully', async () => {
        const user = {
            email: 'test2@test.com',
            password: 'test',
        };
        const result = await service.login(user.email, user.password);
        expect(result).toBeDefined();
    });

    it('should throw error if password is incorrect', async () => {
        const user = {
            email: 'test2@test.com',
            password: 'test6',
        };
        await expect(service.login(user.email, user.password)).rejects.toThrow(
            UnauthorizedException,
        );
    });
});
