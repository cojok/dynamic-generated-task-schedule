import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CronJob } from 'cron';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { Tasks } from '../db/entities/tasks.entity';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>,
    private utilsService: UtilsService,
    private schedulerRegistry: SchedulerRegistry,
    private logger: PinoLogger,
  ) {}

  addCronJob(name: string, schedulerPatter: string) {
    const job = new CronJob(`${schedulerPatter}`, () => {
      this.logger.warn(`time (${schedulerPatter}) for job ${name} to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(
      `job ${name} added for each minute at ${schedulerPatter} pattern!`,
    );
  }

  async save(data) {
    const connector: Tasks = new Tasks();
    connector.name = data.name;
    connector.connectionData = {
      type: data.type,
      schedulePattern: data.schedulerPattern,
    };
    await this.tasksRepository.save(connector);
  }

  async findAllConfigs() {
    const configs = await this.tasksRepository.find();
    return configs;
  }

  stopCron(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    job.stop();
  }

  getCron(name: string) {
    return this.schedulerRegistry.doesExists('cron', name);
  }

  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, _map) => {
      let next;
      try {
        next = value.nextDates().toDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.info(`job: ${key} -> next: ${next}`);
    });
  }

  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`job ${name} deleted!`);
  }
}
