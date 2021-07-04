import { HttpModule } from '@nestjs/common/http';
import { Module } from '@nestjs/common/decorators';
import { Office365Controller } from './office365.controller';
import { Office365Service } from './office365.service';

@Module({
  imports: [HttpModule],
  providers: [Office365Service],
  controllers: [Office365Controller],
})
export class Office365Module {}
