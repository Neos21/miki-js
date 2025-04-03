import * as path from 'node:path';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './core/configs/configuration';
import { AccessLogMiddleware } from './core/middlewares/access-log.middleware';
import { AdminController } from './modules/admin/admin.controller';
import { AdminService } from './modules/admin/admin.service';
import { AdminMisskeyServersController } from './modules/admin/misskey-servers/admin-misskey-servers.controller';
import { AdminMisskeyServersService } from './modules/admin/misskey-servers/admin-misskey-servers.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { DocumentsController } from './modules/documents/documents.controller';
import { DocumentsService } from './modules/documents/documents.service';
import { MisskeyServersController } from './modules/misskey-servers/misskey-servers.controller';
import { MisskeyServersService } from './modules/misskey-servers/misskey-servers.service';
import { TreeController } from './modules/tree/tree.controller';
import { TreeService } from './modules/tree/tree.service';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { DocumentEntity } from './shared/entities/document.entity';
import { MisskeyServerEntity } from './shared/entities/misskey-server.entity';
import { UserEntity } from './shared/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({  // `.env` は自動的に読み込まれる
      isGlobal: true,
      load: [configuration]
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: { expiresIn: '10 days' }  // JWT アクセストークンの有効期限 : https://github.com/vercel/ms
      })
    }),
    ServeStaticModule.forRootAsync({
      useFactory: () => [{
        rootPath: path.resolve(__dirname, '../../frontend/dist')
      }]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type    : 'postgres',
        host    : configService.get<string>('dbHost'),
        port    : configService.get<number>('dbPort'),
        username: configService.get<string>('dbUser'),
        password: configService.get<string>('dbPass'),
        database: configService.get<string>('dbName'),
        entities: [`${__dirname}/**/*.entity{.ts,.js}`],
        synchronize: true,  // スキーマを自動同期する
        logging: true,
        autoLoadEntities: true
      })
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      DocumentEntity,
      MisskeyServerEntity
    ])
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    DocumentsController,
    TreeController,
    MisskeyServersController,
    
    AdminController,
    AdminMisskeyServersController
  ],
  providers: [
    AppService,
    AuthService,
    UsersService,
    DocumentsService,
    TreeService,
    MisskeyServersService,
    
    AdminService,
    AdminMisskeyServersService
  ]
})
export class AppModule {
  public configure(middlewareConsumer: MiddlewareConsumer): void {
    middlewareConsumer.apply(AccessLogMiddleware).forRoutes('*');
  }
}
