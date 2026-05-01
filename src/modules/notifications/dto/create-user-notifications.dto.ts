import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserNotificationsDto {
    @IsNotEmpty({ message: 'notificationId should not be empty' })
    @IsNumber({}, { message: 'notificationId must be a number' })
    notificationId: number;

    @IsNotEmpty({ message: 'userId should not be empty' })
    @IsNumber({}, { message: 'userId must be a number' })
    userId: number;
}
