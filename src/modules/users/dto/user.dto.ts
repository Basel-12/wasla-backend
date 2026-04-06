import { Expose } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class UserDto {
    @Expose()
    id: number;
    @Expose()
    name: string;
    @Expose()
    phone: string;
    @Expose()
    email: string;
    @Expose()
    role: UserRole;
    @Expose()
    isVerified: boolean;
    @Expose()
    isActive: boolean;
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;
}
