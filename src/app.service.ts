import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils/utils.service';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
  constructor(
    private utilsService: UtilsService,
    private configService: ConfigService,
  ) {}

  generateTypeormConfigFile() {
    return this.utilsService.generateTypeormJSONConfigFile(
      this.configService.getTypeormConfigOptions(),
    );
  }
}
