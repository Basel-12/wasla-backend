import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
// import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
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
import { OtpModule } from './modules/otp/otp.module';
import { MailModule } from './modules/mail/mail.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
// import { SerailzeInterceptor } from './common/interceptors/serailze.interceptor';
import { MailQueueModule } from './modules/queues/mail-queue/mail-queue.module';
import { BullModule } from '@nestjs/bullmq';
import { LoggerModule } from './common/utils/logger.module';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { ServeStaticModule } from '@nestjs/serve-static';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { NotificationQueueModule } from './modules/queues/notification-queue/notification-queue.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FavoriteWordsModule } from './modules/favorite-words/favorite-words.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
    imports: [
        LoggerModule,
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
                    synchronize: false,
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
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 30,
                },
            ],
        }),
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    connection: {
                        host: config.get('REDIS_HOST'),
                        port: Number(config.get('REDIS_PORT')) || 6379,
                        // password: config.get('REDIS_PASSWORD'),
                        db: Number(config.get('REDIS_DB')) || 0,
                    },
                };
            },
        }),
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '..', 'public'),
            serveRoot: '/public',
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        OtpModule,
        MailModule,
        MailQueueModule,
        NotificationsModule,
        FirebaseModule,
        NotificationQueueModule,
        JobsModule,
        FavoriteWordsModule,
        AnalyticsModule,
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
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggerInterceptor,
        },
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: SerailzeInterceptor,
        // },
    ],
})
export class AppModule {}
