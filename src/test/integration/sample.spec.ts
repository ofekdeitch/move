import { CreateSampleDto } from 'src/sample/dto/create-sample.dto';
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
        latitude: faker.datatype.float(),
        longitude: faker.datatype.float(),
        timestamp: new Date().toISOString(),
      };

      const createSampleResponse = await driver.request
        .post('/samples')
        .send(createSampleDto);

      expect(createSampleResponse.status).toBe(201);

      // ASSERT

      const getAllSamplesResponse = await driver.request.get('/samples');
      expect(getAllSamplesResponse.status).toBe(200);
    });
  });
});
