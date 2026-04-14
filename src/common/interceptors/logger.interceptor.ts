import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(private logger: Logger) {}
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        //code before the request is handled by the controller

        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();
        const now = new Date();
        const { method, originalUrl, ip } = req;

        this.logger.log(
            `Request ${method} ${originalUrl} from ${ip} at ${now.toISOString()}`,
        );

        return next.handle().pipe(
            tap((data) => {
                const { statusCode } = res;
                this.logger.log(
                    `Response ${statusCode} ${originalUrl} at ${now.toISOString()} takes ${new Date().getTime() - now.getTime()}ms`,
                );
            }),
        );
    }
}
