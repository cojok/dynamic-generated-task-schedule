/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { PinoLogger } from 'nestjs-pino/dist/PinoLogger';
import { Body, Controller, Post, Request } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(
    private service: TaskService,
    private readonly logger: PinoLogger,
  ) {}

  @Post('')
  async createConnector(@Request() req, @Body() createConnectorDto) {
    // eslint-disable-next-line no-param-reassign
    const result = await this.service.save(createConnectorDto);
    const configs = await this.service.findAllConfigs();
    this.logger.error(configs);
    if (configs) {
      for (const i in configs) {
        if (this.service.getCron(configs[i].name)) {
          this.service.stopCron(configs[i].name);
          this.service.deleteCron(configs[i].name);
        }
        this.service.addCronJob(
          configs[i].name,
          configs[i].connectionData.schedulePattern,
        );
      }
    }
    return result;
  }
}
