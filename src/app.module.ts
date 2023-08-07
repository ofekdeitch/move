import { Module } from '@nestjs/common';
import { HealthModule } from './health';
import { SampleModule } from './sample/sample.module';

@Module({
  imports: [HealthModule, SampleModule],
  providers: [],
})
export class AppModule {}
