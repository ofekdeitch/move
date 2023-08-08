import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Config {
  database: DatabaseConfig;
}

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const config = (): Config => ({
  database: databaseConfig(),
});

export const databaseConfig = (): DatabaseConfig => ({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  getConfig(): DatabaseConfig {
    return this.configService.get<DatabaseConfig>('database');
  }
}
