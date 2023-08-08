import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateSampleDto } from './dto/create-sample.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetAllSamplesDto, toGetAllSamplesDto } from './dto';

const PRECISION = 6;

@Controller('samples')
export class SampleController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async getAllSamples(): Promise<GetAllSamplesDto> {
    const rows = await this.prismaService.prisma.sample.findMany();
    return toGetAllSamplesDto(rows);
  }

  @Post('')
  async createSample(@Body() paylod: CreateSampleDto): Promise<void> {
    await this.prismaService.prisma.sample.create({
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
