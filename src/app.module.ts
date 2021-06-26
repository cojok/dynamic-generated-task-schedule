import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { ConfigModule } from './config/config.module';
import { ConnectorsModule } from './connectors/connectors.module';

@Module({
  imports: [
    DbModule,
    UserModule,
    TerminusModule,
    UtilsModule,
    ConfigModule,
    AuthModule,
    ConnectorsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private appService: AppService) {}

  onApplicationBootstrap() {
    return this.appService.generateTypeormConfigFile();
  }
}
