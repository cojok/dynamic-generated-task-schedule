import { HttpModule } from '@nestjs/common/http';
import { Module } from '@nestjs/common/decorators';
import { Office365Controller } from './office365.controller';
import { Office365Service } from './office365.service';
import { ConnectorsModule } from '../connectors/connectors.module';

@Module({
  imports: [HttpModule, ConnectorsModule],
  providers: [Office365Service],
  controllers: [Office365Controller],
})
export class Office365Module {}
