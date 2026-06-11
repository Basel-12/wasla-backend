import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Version,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import type { JwtPayload } from '../auth/types/jwt.paylpad';
import { AnalyticsService } from './analytics.service';
import { LogEventsDto } from './dto/log-events.dto';

@Controller('analytics')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Post('events')
    @HttpCode(HttpStatus.CREATED)
    @Version('1')
    async logEvents(
        @CurrentUser() user: JwtPayload,
        @Body() dto: LogEventsDto,
    ) {
        const inserted = await this.analyticsService.logEvents(user.id, dto);
        return { inserted };
    }

    @Get('summary')
    @Version('1')
    async getSummary(@CurrentUser() user: JwtPayload) {
        const data = await this.analyticsService.getSummary(user.id);
        return { success: true, data };
    }
}
