import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'otps' })
export class Otp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    otp: string;

    @Column()
    reason: string;

    @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE' })
    user: User;
    @Column()
    expiresAt: Date;
}
