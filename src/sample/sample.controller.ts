import { Body, Controller, Post } from '@nestjs/common';
import { CreateSampleDto } from './dto/create-sample.dto';
import { PrismaService } from '../prisma/prisma.service';

const PRECISION = 6;

@Controller('samples')
export class SampleController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('')
  async createSample(@Body() paylod: CreateSampleDto): Promise<void> {
    console.log(paylod);

    await this.prismaService.sample.create({
      data: {
        latitude: trim(paylod.latitude, PRECISION),
        longitude: trim(paylod.longitude, PRECISION),
        createdAt: new Date(paylod.timestamp),
      },
    });
  }
}

function trim(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision);
  return (value * multiplier) / multiplier;
}
