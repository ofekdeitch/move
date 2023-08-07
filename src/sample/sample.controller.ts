import { Body, Controller, Post } from '@nestjs/common';
import { CreateSampleDto } from './dto/create-sample.dto';
import { PrismaService } from '../prisma/prisma.service';

@Controller('samples')
export class SampleController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('')
  async createSample(@Body() paylod: CreateSampleDto): Promise<void> {
    console.log(paylod);

    await this.prismaService.sample.create({
      data: {
        latitude: paylod.latitude,
        longitude: paylod.longitude,
        createdAt: new Date(paylod.timestamp),
      },
    });
  }
}
