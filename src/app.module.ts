import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino/dist';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DbModule } from './db/db.module';
import { HealthController } from './health/health.controller';
import { UtilsModule } from './utils/utils.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    DbModule,
    TerminusModule,
    UtilsModule,
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        prettyPrint: {
          colorize: true,
          levelFirst: true,
          translateTime: 'GMT:dd.mm.yyyy, h:MM:s',
        },
      },
    }),
    TaskModule,
  ],
  controllers: [HealthController],
  providers: [AppService],
})
export class AppModule {
  constructor(private appService: AppService) {}
}
