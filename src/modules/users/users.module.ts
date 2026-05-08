import { BadRequestException, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { I18nService } from 'nestjs-i18n';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        MulterModule.registerAsync({
            inject: [I18nService],
            useFactory: (i18nService: I18nService) => ({
                storage: diskStorage({
                    destination: path.join(
                        process.cwd(),
                        'public',
                        'uploads',
                        'avatars',
                    ),
                    filename: (req, file, cb) => {
                        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                        cb(null, `${uniqueName}${extname(file.originalname)}`);
                    },
                }),
                limits: {
                    fileSize: 1024 * 1024 * 5, // 5MB
                },
                fileFilter: (req, file, cb) => {
                    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                        return cb(
                            new BadRequestException(
                                i18nService.t(
                                    'validation.onlyImageFilesAllowed',
                                ),
                            ),
                            false,
                        );
                    }

                    cb(null, true);
                },
            }),
        }),
        NotificationsModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
