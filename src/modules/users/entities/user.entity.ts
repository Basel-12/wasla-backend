import { UserNotification } from '../../notifications/entities/user.notifications.entity';
import { Otp } from '../../otp/entities/otp.entity';
import {
    Column,
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

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

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

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;
}
