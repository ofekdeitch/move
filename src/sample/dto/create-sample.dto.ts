import { DateDto } from 'src/common/dto/date';

export interface CreateSampleDto {
  latitude: number;
  longitude: number;
  timestamp: DateDto;
}
