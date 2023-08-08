import { Module } from '@nestjs/common';
import { HealthModule } from './health';
import { SampleModule } from './sample/sample.module';
import { CommonModule } from './common';
import { HeatmapModule } from './heatmap';

@Module({
  imports: [CommonModule, HealthModule, SampleModule, HeatmapModule],
  providers: [],
})
export class AppModule {}
