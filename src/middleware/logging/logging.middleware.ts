import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: () => void) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const startTime = Date.now();

    this.logger.log(
      `Pegando ${method} request para ${originalUrl} de ${ip} - ${userAgent} `,
    );

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logger.log(
        `Finalizado ${method} request para ${originalUrl} de ${ip} - ${userAgent} - ${res.statusCode} - ${duration}ms`,
      );

      if (res.statusCode >= 400) {
        this.logger.error(
          `Erro no ${method} request para ${originalUrl} de ${ip} - ${userAgent} - ${res.statusCode} - ${duration}ms`,
        );
      }
    });

    res.on('error', (err) => {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Erro no ${method} request para ${originalUrl} de ${ip} - ${userAgent} - ${res.statusCode} - ${duration}ms - ${err.message}`,
      );
    });

    res.on('timeout', () => {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Timeout no ${method} request para ${originalUrl} de ${ip} - ${userAgent} - ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
