import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEventsDto } from './dto/log-events.dto';
import { AnalyticsEvent } from './entities/analytics-event.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(AnalyticsEvent)
        private readonly repo: Repository<AnalyticsEvent>,
    ) {}

    async logEvents(userId: number, dto: LogEventsDto): Promise<number> {
        const rows = dto.events.map((e) =>
            this.repo.create({
                user: { id: userId },
                label: e.label,
                confidence: e.confidence,
                session_id: e.session_id,
                ts: e.timestamp,
            }),
        );
        await this.repo.save(rows);
        return rows.length;
    }

    async getSummary(userId: number) {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

        const [totalSigns, thisWeek, avgRow, totalSessions, topSigns] =
            await Promise.all([
                this.repo.count({ where: { user: { id: userId } } }),

                this.repo
                    .createQueryBuilder('e')
                    .where('e.userId = :userId', { userId })
                    .andWhere('e.ts >= :weekAgo', { weekAgo })
                    .getCount(),

                this.repo
                    .createQueryBuilder('e')
                    .select('AVG(e.confidence)', 'avg')
                    .where('e.userId = :userId', { userId })
                    .getRawOne<{ avg: string | null }>(),

                this.repo
                    .createQueryBuilder('e')
                    .select('COUNT(DISTINCT e.session_id)', 'cnt')
                    .where('e.userId = :userId', { userId })
                    .andWhere('e.session_id IS NOT NULL')
                    .getRawOne<{ cnt: string }>(),

                this.repo
                    .createQueryBuilder('e')
                    .select('e.label', 'label')
                    .addSelect('COUNT(*)', 'count')
                    .addSelect('AVG(e.confidence)', 'avgConfidence')
                    .where('e.userId = :userId', { userId })
                    .groupBy('e.label')
                    .orderBy('count', 'DESC')
                    .limit(5)
                    .getRawMany<{
                        label: string;
                        count: string;
                        avgConfidence: string;
                    }>(),
            ]);

        return {
            totalSigns,
            thisWeek,
            avgConfidence: avgRow?.avg ? parseFloat(avgRow.avg) : 0,
            totalSessions: totalSessions?.cnt ? parseInt(totalSessions.cnt) : 0,
            topSigns: topSigns.map((r) => ({
                label: r.label,
                count: parseInt(r.count),
                avgConfidence: parseFloat(r.avgConfidence),
            })),
        };
    }
}
