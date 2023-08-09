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

import { makeConnectionString } from '../../prisma/connection-string';
import { InMemoryState, SampleTestModel } from './glossary';
import { runMigrations } from './prisma';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../../prisma/prisma.service';

export class TestDriver {
  private app: INestApplication;
  private postgresContainer?: StartedPostgreSqlContainer;

  private state = createInMemoryState();

  async start() {
    await this.startPostgres();
    await this.runMigrations();
    await this.startApp();
    await this.persistState();
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
    const config = this.getDatabaseConfig();
    const connectionString = makeConnectionString(config);

    await runMigrations(connectionString);
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

  async clearState() {
    this.state = createInMemoryState();
    await this.truncateAllTables();
  }

  private async truncateAllTables() {
    await this.app.get(PrismaService).prisma.sample.deleteMany();
  }

  createSample(options?: Partial<SampleTestModel>): SampleTestModel {
    const sample = generateSample(options);
    this.state.samples.push(sample);
    return sample;
  }

  private async persistState() {
    await this.persistSamples();
  }

  private async persistSamples() {
    for (const sample of this.state.samples) {
      await this.app.get(PrismaService).prisma.sample.create({
        data: {
          latitude: sample.latitude,
          longitude: sample.longitude,
          createdAt: new Date(),
        },
      });
    }
  }
}

function createInMemoryState(): InMemoryState {
  return {
    samples: [],
  };
}

function generateSample(
  options: Partial<SampleTestModel> = {},
): SampleTestModel {
  return {
    latitude: options.latitude ?? faker.location.latitude(),
    longitude: options.longitude ?? faker.location.longitude(),
  };
}
