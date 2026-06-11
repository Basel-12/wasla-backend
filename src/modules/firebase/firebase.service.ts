import {
    Injectable,
    InternalServerErrorException,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { BatchResponse, Message, MulticastMessage, getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: Logger,
    ) {}

    onModuleInit() {
        this.logger.log('Initializing Firebase service');
        if (!getApps().length) {
            initializeApp({
                credential: cert({
                    projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
                    privateKey: this.configService
                        .get<string>('FIREBASE_PRIVATE_KEY')
                        ?.replace(/\\n/g, '\n'),
                    clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
                }),
            });
            this.logger.log('Firebase service initialized');
        }
    }

    async sendToOne(
        fcmToken: string,
        title: string,
        body: string,
        data?: Record<string, any>,
    ): Promise<string> {
        try {
            const message: Message = {
                token: fcmToken,
                notification: { title, body },
                data,
                android: {
                    priority: 'high',
                    notification: { sound: 'default' },
                },
                apns: {
                    payload: { aps: { sound: 'default' } },
                },
            };
            return await getMessaging().send(message);
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Failed to send notification');
        }
    }

    async sendToMultiple(
        fcmTokens: string[],
        title: string,
        body: string,
        data?: Record<string, any>,
    ): Promise<BatchResponse> {
        try {
            const message: MulticastMessage = {
                tokens: fcmTokens,
                notification: { title, body },
                data: data ?? {},
            };
            return await getMessaging().sendEachForMulticast(message);
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Failed to send notification');
        }
    }
}
