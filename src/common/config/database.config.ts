import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Config {
  database: DatabaseConfig;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema: string;
}

export const config = (): Config => ({
  database: databaseConfig(),
});

export const databaseConfig = (): DatabaseConfig => ({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: tryParseInt(process.env.DATABASE_PORT) ?? 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: process.env.DATABASE_SCHEMA ?? 'public',
});

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}

  get(): DatabaseConfig {
    return this.configService.get<DatabaseConfig>('database');
  }
}

function tryParseInt(value: string): number | undefined {
  try {
    return parseInt(value, 10);
  } catch {
    return undefined;
  }
}
