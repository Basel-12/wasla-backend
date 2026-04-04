import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import {
    AcceptLanguageResolver,
    HeaderResolver,
    I18nModule,
    QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        UsersModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    type: 'postgres',
                    host: config.get('DB_HOST'),
                    port: Number(config.get('DB_PORT')) || 5432,
                    username: config.get('DB_USER'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_NAME'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                };
            },
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: path.join(__dirname, '/i18n/'),
                watch: true,
            },
            resolvers: [
                AcceptLanguageResolver,
                { use: QueryResolver, options: ['lang'] },
                new HeaderResolver(['x-lang']),
            ],
        }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            global: true,
            useFactory: (config: ConfigService) => {
                return {
                    secret: config.get('JWT_SECRET'),
                };
            },
        }),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                whitelist: true,
            }),
        },
    ],
})
export class AppModule {}
