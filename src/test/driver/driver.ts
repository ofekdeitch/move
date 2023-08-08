import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';

export class TestDriver {
  private app: INestApplication;
  private postgresContainer?: StartedPostgreSqlContainer;

  async start() {
    await this.startPostgres();
    await this.startApp();
  }

  private async startApp() {
    const moduleBuilder = Test.createTestingModule({
      imports: [AppModule],
    });
    const moduleRef = await moduleBuilder.compile();

    this.app = moduleRef.createNestApplication();
    await this.app.init();
  }

  private async startPostgres() {
    const postgresContainer = await new PostgreSqlContainer().start();
    this.postgresContainer = postgresContainer;
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
