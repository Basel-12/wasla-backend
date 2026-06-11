import { User } from '../../users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'analytics_events' })
@Index(['user'])
@Index(['ts'])
export class AnalyticsEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Column({ length: 100 })
    label: string;

    @Column({ type: 'float' })
    confidence: number;

    @Column({ length: 64, nullable: true })
    session_id: string;

    @Column({ type: 'bigint' })
    ts: number;
}
