import {
    IsEmail,
    IsNotEmpty,
    MinLength,
    IsString,
    IsEnum,
} from 'class-validator';
import { Language } from '../entities/user.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

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

    @IsNotEmpty({
        message: i18nValidationMessage(
            'validation.must be a valid email address',
        ),
    })
    @IsEmail(
        {},
        {
            message: i18nValidationMessage(
                'validation.must be a valid email address',
            ),
        },
    )
    email: string;

    @IsNotEmpty({
        message: i18nValidationMessage('validation.must be a string'),
    })
    @MinLength(8, {
        message: i18nValidationMessage(
            'validation.must be at least {{minLength}} characters long',
            { minLength: 8 },
        ),
    })
    password: string;

    @IsNotEmpty({
        message: i18nValidationMessage('validation.must be a string'),
    })
    @IsString({ message: i18nValidationMessage('validation.must be a string') })
    @IsEnum(Language, {
        message: i18nValidationMessage('validation.must be a valid language'),
    })
    preferredLanguage: string;
}
