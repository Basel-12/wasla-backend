import { Transform } from 'class-transformer';
import { IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty({ message: 'title should not be empty' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'body should not be empty' })
    body: string;

    @IsJSON({ message: 'data must be a valid JSON object' })
    @IsOptional({ message: 'data is optional' })
    @Transform(({ value }): Record<string, unknown> | undefined => {
        if (!value) return undefined;

        const parsed: unknown =
            typeof value === 'string' ? JSON.parse(value) : value;

        if (
            typeof parsed !== 'object' ||
            parsed === null ||
            Array.isArray(parsed)
        ) {
            return undefined;
        }

        return parsed as Record<string, unknown>;
    })
    data?: Record<string, unknown>;
}
