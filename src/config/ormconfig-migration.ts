import { ConfigService } from './config.service';

const configService: ConfigService = new ConfigService();

const config = configService.getTypeormConfigOptions();
export = config;
