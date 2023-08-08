import { Sample } from '@prisma/client';
import { DateDto } from 'src/common/dto/date';

export interface SampleDto {
  id: string;
  latitude: number;
  longitude: number;
  createdAt: DateDto; // ISO
}

export type GetAllSamplesDto = SampleDto[];

export function toGetAllSamplesDto(dao: Sample[]): GetAllSamplesDto {
  return dao.map(toSampleDto);
}

function toSampleDto(dao: Sample): SampleDto {
  return {
    id: dao.id,
    latitude: dao.latitude.toNumber(),
    longitude: dao.longitude.toNumber(),
    createdAt: dao.createdAt.toISOString(),
  };
}
