// import { Injectable } from '@nestjs/common';
// import {
//     InjectThrottlerOptions,
//     InjectThrottlerStorage,
//     ThrottlerGuard,
// } from '@nestjs/throttler';
// import {
//     type ThrottlerModuleOptions,
//     ThrottlerStorage,
// } from '@nestjs/throttler';
// import { Request } from 'express';
// import { I18nService } from 'nestjs-i18n';

// @Injectable()
// export class ThrottleGuard extends ThrottlerGuard {
//     constructor(
//         @InjectThrottlerOptions() options: ThrottlerModuleOptions,
//         @InjectThrottlerStorage() storage: ThrottlerStorage,
//         private readonly i18nservice: I18nService,
//     ) {
//         super(options, storage);
//     }

//     protected async getTracker(req: Request): Promise<string> {
//         return req.user?.id ? `user-${req.user.id}` : `ip-${req.ip}`;
//     }
// }
