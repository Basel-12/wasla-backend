import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdatePasswordDto {
    @IsString({ message: i18nValidationMessage('validation.must be a string') })
    @IsNotEmpty({ message: 'Old password is required' })
    @MinLength(8, {
        message: i18nValidationMessage(
            'validation.must be at least {{minLength}} characters long',
            { minLength: 8 },
        ),
    })
    oldPassword: string;

    @IsString({ message: i18nValidationMessage('validation.must be a string') })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.must be a string'),
    })
    @MinLength(8, {
        message: i18nValidationMessage(
            'validation.must be at least {{minLength}} characters long',
            { minLength: 8 },
        ),
    })
    newPassword: string;
}
