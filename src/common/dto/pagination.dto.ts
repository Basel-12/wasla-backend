import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @Transform(({ value }) => Number(value), { toClassOnly: true })
    @IsPositive()
    page: number = 1;

    @IsOptional()
    @Transform(({ value }) => Number(value), { toClassOnly: true })
    @IsPositive()
    limit: number = 10;

    get skip(): number {
        return (this.page - 1) * this.limit;
    }
}
