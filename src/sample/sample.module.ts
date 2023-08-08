import { Module } from '@nestjs/common';
import { SampleController } from './sample.controller';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  controllers: [SampleController],
})
export class SampleModule {}
