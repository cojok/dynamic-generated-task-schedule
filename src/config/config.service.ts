import { readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { parse } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigService {
  envPath: string;

  nodeEnv: string = process.env.NODE_ENV || '';

  envConfig: { [key: string]: string };

  constructor() {
    if (!['dev', 'stg', 'prod'].includes('dev')) {
      throw new Error('Please specify a valid NODE_ENV var');
    }

    this.envPath = resolve(process.cwd(), `.env.${this.nodeEnv}`);
    this.envConfig = parse(readFileSync(this.envPath, 'utf8'));
  }

  public get(key: string): string {
    return this.envConfig[key] || process.env[key];
  }

  public getTypeormConfigOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres' as 'postgres',
      host: this.get('SC_PGDB_HOST'),
      port: Number(this.get('SC_PGDB_PORT')),
      username: this.get('SC_PGDB_USER'),
      password: this.get('SC_PGDB_PASS'),
      database: this.get('SC_PGDB_NAME'),
      entities: [`${__dirname}/../db/entities/**/*.entity{.ts,.js}`],
      synchronize: true,
      logging: this.get('NODE_ENV') === 'dev',
      migrations: [`${__dirname}/../db/migrations/**/*{.ts,.js}`],
      cli: {
        migrationsDir: 'src/db/migrations',
      },
      schema: 'public',
      migrationsRun: Boolean(this.get('SC_PGDB_RUN_MIGRATIONS')) || false,
    };
  }
}
