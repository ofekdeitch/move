import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { HeatmapController } from './heatmap.controller';

@Module({
  imports: [PrismaModule],
  controllers: [HeatmapController],
})
export class HeatmapModule {}
