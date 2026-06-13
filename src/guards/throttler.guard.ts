import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    const ip = req.ip || '';
    const userAgent = req.headers['user-agent'] || '';

    return Promise.resolve(`${ip}-${userAgent}`);
  }
}
