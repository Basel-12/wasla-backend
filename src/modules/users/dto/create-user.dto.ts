import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'name should not be empty' })
    @IsString()
    @MinLength(2)
    name: string;

    // @IsNotEmpty({ message: 'phone should not be empty' })
    // @IsNumberString()
    // @IsPhoneNumber('EG', {
    //     message: 'phone number must be a valid Egyptian phone number',
    // })
    // phone: string;

    @IsNotEmpty({ message: 'email should not be empty' })
    @IsEmail({}, { message: 'email must be a valid email address' })
    email: string;

    @IsNotEmpty({ message: 'password should not be empty' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}
