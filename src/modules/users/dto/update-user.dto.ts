import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDto {
    @IsString({ message: i18nValidationMessage('validation.must be a string') })
    @IsOptional()
    name?: string;

    @IsString({ message: i18nValidationMessage('validation.must be a string') })
    @IsOptional()
    preferredLanguage?: string;

    @IsString({ message: i18nValidationMessage('validation.must be a string') })
    @IsOptional()
    @IsPhoneNumber('EG', {
        message: i18nValidationMessage(
            'validation.must be a valid Egyptian phone number',
        ),
    })
    phone?: string;
}
