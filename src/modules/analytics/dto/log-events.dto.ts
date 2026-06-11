import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';

export class AnalyticsEventItemDto {
    @IsString()
    @IsNotEmpty()
    label: string;

    @IsNumber()
    @Min(0)
    @Max(1)
    confidence: number;

    @IsNumber()
    timestamp: number;

    @IsOptional()
    @IsString()
    session_id?: string;
}

export class LogEventsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnalyticsEventItemDto)
    events: AnalyticsEventItemDto[];
}
