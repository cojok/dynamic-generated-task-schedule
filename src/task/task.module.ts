/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { Module, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { Tasks } from '../db/entities/tasks.entity';
import { UtilsModule } from '../utils/utils.module';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Tasks]), UtilsModule],
  providers: [TaskService, ConfigService, SchedulerRegistry],
  controllers: [TaskController],
})
export class TaskModule implements OnModuleInit {
  constructor(private service: TaskService, private logger: PinoLogger) {}

  async onModuleInit() {
    this.logger.info('Task module init');
    const configs = await this.service.findAllConfigs();
    this.logger.error(configs);
    if (configs) {
      for (const i in configs) {
        this.service.addCronJob(
          configs[i].name,
          configs[i].connectionData.schedulePattern,
        );
      }
    }
  }
}
