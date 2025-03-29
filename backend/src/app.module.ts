import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './core/configs/configuration';
import { AccessLogMiddleware } from './core/middlewares/access-log.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({  // `.env` は自動的に読み込まれる
      isGlobal: true,  // 各 Module での `imports` を不要にする
      load: [configuration]
    }),
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  /** 独自のアクセスログ出力ミドルウェアを適用する */
  public configure(middlewareConsumer: MiddlewareConsumer): void {
    middlewareConsumer.apply(AccessLogMiddleware).forRoutes('*');
  }
}
