import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from '../config/config.module';
import { User } from '../db/entities/user.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User]), UtilsModule],
  providers: [UserService, ConfigService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
