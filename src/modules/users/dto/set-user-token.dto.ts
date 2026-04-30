import { IsNotEmpty, IsString } from 'class-validator';

export class SetUserFirebaseTokenDto {
    @IsNotEmpty({ message: 'Firebase token is required' })
    @IsString({ message: 'Firebase token must be a string' })
    firebaseToken: string;

    @IsNotEmpty({ message: 'Device ID is required' })
    @IsString({ message: 'Device ID must be a string' })
    deviceId: string;
}
