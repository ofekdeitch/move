import { Controller, Get } from '@nestjs/common';
import { GetHeatmapResponse, HeatmapPoint } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { GeoLocation, Length } from '../geo';
import { Sample } from '@prisma/client';
import { countByValue } from '../common/utils/array.utils';
import { limitPrecision } from '../common/utils/math';

const SLOT_SIZE = Length.meters(20);

@Controller('heatmap')
export class HeatmapController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  async getHeatmap(): Promise<GetHeatmapResponse> {
    const samples = await this.fetchSamples();

    const slots = samples.map((sample) =>
      this.getHeatmapPoint(sample.location),
    );
    const counters = countByValue(slots, (s) => getGeoLocationKey(s));

    return {
      points: counters.entries().map(
        ([location, count]): HeatmapPoint => ({
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          value: count,
        }),
      ),
    };
  }

  private async fetchSamples(): Promise<SampleModel[]> {
    const samples = await this.prismaService.prisma.sample.findMany();
    return samples.map((s) => toSampleModel(s));
  }

  private getHeatmapPoint(location: GeoLocation): GeoLocation {
    const distanceFromXAxis = getDistanceFromEquator(location);
    const slotsFromXAxis = Math.floor(
      distanceFromXAxis.toMeters() / SLOT_SIZE.toMeters(),
    );

    const distanceFromYAxis = getDistanceFromGreenwich(location);
    const slotsFromYAxis = Math.floor(
      distanceFromYAxis.toMeters() / SLOT_SIZE.toMeters(),
    );

    const distanceFromSlotYValue =
      distanceFromXAxis.toMeters() - slotsFromXAxis * SLOT_SIZE.toMeters();

    const distanceFromSlotXValue =
      distanceFromYAxis.toMeters() - slotsFromYAxis * SLOT_SIZE.toMeters();

    return location
      .moveSouth(Length.meters(distanceFromSlotYValue))
      .moveWest(Length.meters(distanceFromSlotXValue));
  }
}

function getDistanceFromEquator(location: GeoLocation): Length {
  const shiftedToXAxis = new GeoLocation({
    y: 0,
    x: location.x,
  });

  return location.getDistanceFrom(shiftedToXAxis);
}

function getDistanceFromGreenwich(location: GeoLocation): Length {
  const shiftedToYAxis = new GeoLocation({
    y: location.y,
    x: 0,
  });

  return location.getDistanceFrom(shiftedToYAxis);
}

function toSampleModel(sample: Sample): SampleModel {
  const latitude = sample.latitude.toNumber();
  const longitude = sample.longitude.toNumber();

  return {
    id: sample.id,
    location: new GeoLocation({
      y: latitude,
      x: longitude,
    }),
    createdAt: sample.createdAt,
  };
}

interface SampleModel {
  id: string;
  location: GeoLocation;
  createdAt: Date;
}

interface GeoLocationKey {
  latitude: number;
  longitude: number;
}

const PRECISION = 4;

function getGeoLocationKey(location: GeoLocation): GeoLocationKey {
  return {
    latitude: limitPrecision(location.y, PRECISION),
    longitude: limitPrecision(location.x, PRECISION),
  };
}
