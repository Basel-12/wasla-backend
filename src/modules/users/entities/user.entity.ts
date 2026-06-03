import { FavoriteWords } from 'src/modules/favorite-words/entites/favorite-words.entity';
import { UserNotification } from '../../notifications/entities/user.notifications.entity';
import { Otp } from '../../otp/entities/otp.entity';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

export enum Language {
    AR = 'ar',
    EN = 'en',
}

export enum Provider {
    LOCAL = 'local',
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
}
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true, type: 'varchar' })
    password: string | null;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ enum: Provider, default: Provider.LOCAL })
    provider: string;

    @Column({ nullable: true, type: 'varchar' })
    providerId: string | null;

    @OneToMany(() => Otp, (otp) => otp.user)
    otps: Otp[];

    @Column({ default: false })
    isVerified: boolean;

    @Column({ type: 'enum', enum: Language, default: Language.AR })
    preferredLanguage: string;

    @Column({ default: 'avatar.png' })
    avatar: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    firebaseToken: string;

    @Column({ nullable: true })
    deviceId: string;

    @OneToMany(
        () => UserNotification,
        (userNotification) => userNotification.user,
    )
    userNotifications: UserNotification[];

    @OneToMany(() => FavoriteWords, (favoriteWords) => favoriteWords.user)
    favoriteWords: FavoriteWords[];

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
