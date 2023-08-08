import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import { DatabaseConfigService, config } from './database.config';

@Module({
  imports: [
    BaseConfigModule.forRoot({
      load: [config],
    }),
  ],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class ConfigModule {}
