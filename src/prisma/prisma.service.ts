import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DatabaseConfigService } from '../common/config/database.config';
import { makeConnectionString } from './connection-string';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly prisma: PrismaClient;

  constructor(private readonly configService: DatabaseConfigService) {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: this.getConnectionUrl(),
        },
      },
    });
  }

  private getConnectionUrl(): string {
    const config = this.configService.get();
    return makeConnectionString(config);
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
