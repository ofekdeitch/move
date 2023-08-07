import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';

export class TestDriver {
  private app: INestApplication;

  async start() {
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

  async stop() {
    await this.stopApp();
  }

  private async stopApp() {
    await this.app.close();
  }

  get request() {
    this.validateDriverStarted();
    return request(this.app.getHttpServer());
  }

  private validateDriverStarted() {
    if (!this.app) throw Error('Please call driver.start()');
  }
}
