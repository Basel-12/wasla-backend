import { Transform } from 'class-transformer';
import { IsObject, IsOptional, IsString } from 'class-validator';

function parseJsonField(value: unknown): Record<string, unknown> | undefined {
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
}

export class UpdateNotificationDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    type: string;

    @IsString()
    @IsOptional()
    body: string;

    @IsObject({ message: 'title_translations must be a valid JSON object' })
    @IsOptional()
    @Transform(({ value }) => parseJsonField(value))
    title_translations?: Record<string, string>;

    @IsObject({ message: 'body_translations must be a valid JSON object' })
    @IsOptional()
    @Transform(({ value }) => parseJsonField(value))
    body_translations?: Record<string, string>;

    @IsObject({ message: 'data must be a valid JSON object' })
    @IsOptional()
    @Transform(({ value }) => parseJsonField(value))
    data?: Record<string, unknown>;
}
