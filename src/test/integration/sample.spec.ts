import { CreateSampleDto, GetAllSamplesDto } from 'src/sample/dto';
import { TestDriver } from '../driver';
import { faker } from '@faker-js/faker';

describe('Sample', () => {
  const driver = new TestDriver();

  afterEach(async () => {
    await driver.stop();
  });

  describe('when creating a sampel', () => {
    it('should be persisted', async () => {
      // ARRANGE
      await driver.start();

      // ACT

      const createSampleDto: CreateSampleDto = {
        latitude: faker.datatype.float({ min: -90, max: 90 }),
        longitude: faker.datatype.float({ min: -180, max: 180 }),
        timestamp: new Date().toISOString(),
      };

      const createSampleResponse = await driver.request
        .post('/samples')
        .send(createSampleDto);

      expect(createSampleResponse.status).toBe(201);

      // ASSERT

      const getAllSamplesResponse = await driver.request.get('/samples');
      expect(getAllSamplesResponse.status).toBe(200);

      const actualBody = getAllSamplesResponse.body as GetAllSamplesDto;
      expect(actualBody).toHaveLength(1);

      expect(actualBody[0].latitude).toBe(createSampleDto.latitude);
      expect(actualBody[0].longitude).toBe(createSampleDto.longitude);
      expect(actualBody[0].createdAt).toBe(createSampleDto.timestamp);
    }, 30000);
  });
});
