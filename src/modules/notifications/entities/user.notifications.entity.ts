import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Notification } from './notification.entity';

@Entity({ name: 'user_notifications' })
export class UserNotification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.userNotifications, {
        onDelete: 'CASCADE',
    })
    user: User;

    @ManyToOne(
        () => Notification,
        (notification) => notification.userNotifications,
        { onDelete: 'CASCADE' },
    )
    notification: Notification;

    @Column({ default: false })
    isRead: boolean;

    @Column({ nullable: true })
    readAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
