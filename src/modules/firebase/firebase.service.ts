import {
    Injectable,
    InternalServerErrorException,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: Logger,
    ) {}

    onModuleInit() {
        this.logger.log('Initializing Firebase service');
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: this.configService.get<string>(
                        'FIREBASE_PROJECT_ID',
                    ),
                    privateKey: this.configService
                        .get<string>('FIREBASE_PRIVATE_KEY')
                        ?.replace(/\\n/g, '\n'),
                    clientEmail: this.configService.get<string>(
                        'FIREBASE_CLIENT_EMAIL',
                    ),
                }),
            });
        }
    }

    async sendToOne(
        fcmToken: string,
        title: string,
        body: string,
        data?: Record<string, any>,
    ): Promise<string> {
        try {
            const message: admin.messaging.Message = {
                token: fcmToken,
                notification: {
                    title,
                    body,
                },
                data,
                android: {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                        },
                    },
                },
            };
            const response = await admin.messaging().send(message);
            return response;
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException(
                'Failed to send notification',
            );
        }
    }

    async sendToMultiple(
        fcmTokens: string[],
        title: string,
        body: string,
        data?: Record<string, any>,
    ): Promise<admin.messaging.BatchResponse> {
        try {
            const message: admin.messaging.MulticastMessage = {
                tokens: fcmTokens,
                notification: {
                    title,
                    body,
                },
                data: data ?? {},
            };
            const response = await admin
                .messaging()
                .sendEachForMulticast(message);
            return response;
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException(
                'Failed to send notification',
            );
        }
    }
}
