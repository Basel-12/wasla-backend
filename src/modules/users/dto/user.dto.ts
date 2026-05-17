import { Expose, Transform } from 'class-transformer';
import { Provider, User, UserRole } from '../entities/user.entity';

export class UserDto {
    @Expose()
    id!: number;
    @Expose()
    name!: string;
    @Expose()
    phone!: string;
    @Expose()
    email!: string;
    @Expose()
    role!: UserRole;
    @Expose()
    isVerified!: boolean;
    @Expose()
    isActive!: boolean;
    @Expose()
    createdAt!: Date;
    @Expose()
    updatedAt!: Date;
    @Expose()
    preferredLanguage!: string;
    @Expose()
    @Transform(({ obj }: { obj: User }) => {
        if (
            obj.provider !== Provider[Provider.LOCAL] &&
            obj.avatar !== 'avatar.png'
        )
            return obj.avatar;
        return `${process.env.APP_URL}/public/uploads/avatars/${obj.avatar ?? 'avatar.png'}`;
    })
    avatar!: string;
}
