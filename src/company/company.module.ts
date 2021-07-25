import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { ConfigModule } from '../config/config.module';
import { UtilsModule } from '../utils/utils.module';
import { Company } from '../db/entities/company.entity';
import { ConfigService } from '../config/config.service';
import { UserService } from '../user/user.service';
import { User } from '../db/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Company, User]),
    UtilsModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService, ConfigService, UserService],
  exports: [CompanyService],
})
export class CompanyModule {}
