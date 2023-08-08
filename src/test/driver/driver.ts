import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';
import {
  DatabaseConfig,
  DatabaseConfigService,
} from '../../common/config/database.config';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { makeConnectionString } from '../../prisma/connection-string';

const execAsync = promisify(exec);

export class TestDriver {
  private app: INestApplication;
  private postgresContainer?: StartedPostgreSqlContainer;

  async start() {
    await this.startPostgres();
    await this.runMigrations();
    await this.startApp();
  }

  private async startApp() {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseConfigService)
      .useValue({ get: () => this.getDatabaseConfig() });

    const moduleRef = await moduleBuilder.compile();

    this.app = moduleRef.createNestApplication();
    await this.app.init();
  }

  private getDatabaseConfig(): DatabaseConfig {
    const postgresContainer = this.postgresContainer;

    if (!postgresContainer) {
      throw Error('Postgres testcontainer not started');
    }

    return {
      host: postgresContainer.getHost(),
      port: postgresContainer.getPort(),
      database: postgresContainer.getDatabase(),
      username: postgresContainer.getUsername(),
      password: postgresContainer.getPassword(),
      schema: 'public',
    };
  }

  private async startPostgres() {
    const postgresContainer = await new PostgreSqlContainer().start();
    this.postgresContainer = postgresContainer;
  }

  private async runMigrations() {
    await execAsync('npx prisma db push', {
      env: { ...process.env, DATABASE_URL: this.getDatabaseUrl() },
    });
  }

  private getDatabaseUrl(): string {
    const config = this.getDatabaseConfig();
    return makeConnectionString(config);
  }

  async stop() {
    await this.stopApp();
    await this.stopPostgres();
  }

  private async stopApp() {
    await this.app.close();
  }

  private async stopPostgres() {
    await this.postgresContainer?.stop();
  }

  get request() {
    this.validateDriverStarted();
    return request(this.app.getHttpServer());
  }

  private validateDriverStarted() {
    if (!this.app) throw Error('Please call driver.start()');
  }
}
