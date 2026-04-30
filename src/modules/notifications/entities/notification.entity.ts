import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserNotification } from './user.notifications.entity';

@Entity({ name: 'notifications' })
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column({ type: 'jsonb', nullable: true })
    data: Record<string, any>;

    @OneToMany(
        () => UserNotification,
        (userNotification) => userNotification.notification,
    )
    userNotifications: UserNotification[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
