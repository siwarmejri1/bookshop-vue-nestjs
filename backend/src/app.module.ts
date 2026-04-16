import {
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { BooksModule } from './books/books.module';
import { FirstMiddleware } from './middlewares/first/first.middleware';
import { SecondMiddleware } from './middlewares/second/second.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // ✅ ConfigModule en PREMIER et global pour que ConfigService
    //    soit disponible partout, y compris dans TypeOrmModule
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host:     config.get<string>('DB_HOST'),
        port:     config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,   // crée les tables auto en dev
      }),
    }),

    TasksModule,
    BooksModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  // ✅ ConfigService toujours disponible grâce à isGlobal: true
  constructor(private configSer: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecondMiddleware).forRoutes('');
    consumer.apply(FirstMiddleware).forRoutes({
      path: 'tasks/*',
      method: RequestMethod.GET,
    });
  }
}
useFactory: (config: ConfigService) => {

  console.log('=== CONFIG DB ===')
  console.log('HOST     :', config.get('DB_HOST'))
  console.log('PORT     :', config.get('DB_PORT'))
  console.log('USERNAME :', config.get('DB_USERNAME'))
  console.log('PASSWORD :', config.get('DB_PASSWORD'))
  console.log('NAME     :', config.get('DB_NAME'))
  console.log('=================')

  return {
    type: 'mysql',
    host:     config.get<string>('DB_HOST'),
    port:     config.get<number>('DB_PORT'),
    username: config.get<string>('DB_USERNAME'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),
    autoLoadEntities: true,
    synchronize: true,
  }
}