import {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
    UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
    new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerailzeInterceptor(dto));
}

export class SerailzeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        //code before the request is handled by the controller
        return next.handle().pipe(
            map((data: any) => {
                //code after the request is handled by the controller
                const payload: unknown = data?.data ?? data;
                return plainToClass<unknown, unknown>(this.dto, payload, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}
