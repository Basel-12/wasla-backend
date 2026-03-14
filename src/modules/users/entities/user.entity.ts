import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity({ name: 'users' })
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    phone: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ nullable: true })
    otp: string;

    @Column({ nullable: true })
    otpExpiresAt: Date;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    firebaseToken: string;

    @Column({ nullable: true })
    deletedAt: Date;
}
