import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProxyModule } from './proxy/proxy.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      // faz com que o limite seja de 100 requisições por minuto
      throttlers: [
        {
          name: 'short',
          ttl: 1000, // 1 segundo
          limit: 10, // 10 requisições por segundo
        },
        {
          name: 'medium',
          ttl: 60000, // 1 minuto
          limit: 100, // 100 requisições por minuto
        },
        {
          name: 'long',
          ttl: 900000, // 15 minutos
          limit: 1000, // 1000 requisições por 15 minutos
        },
      ],
    }),
    ProxyModule,
    MiddlewareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
