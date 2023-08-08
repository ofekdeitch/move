import { Module } from '@nestjs/common';
import { HealthModule } from './health';
import { SampleModule } from './sample/sample.module';
import { CommonModule } from './common';

@Module({
  imports: [CommonModule, HealthModule, SampleModule],
  providers: [],
})
export class AppModule {}
