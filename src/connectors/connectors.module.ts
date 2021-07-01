import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { Connectors } from '../db/entities/connectors.entity';
import { ConnectorsController } from './connectors.controller';
import { ConnectorsService } from './connectors.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Connectors]), UtilsModule],
  providers: [ConnectorsService, ConfigService],
  controllers: [ConnectorsController],
  exports: [ConnectorsService],
})
export class ConnectorsModule {}
