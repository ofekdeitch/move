import { TestDriver } from '../driver';

describe('Health', () => {
  const driver = new TestDriver();

  beforeEach(async () => {
    await driver.start();
  });

  afterEach(async () => {
    await driver.stop();
  });

  describe('when GETing /health', () => {
    it('should return 200', async () => {
      const getHealthResponse = await driver.request.get('/health');
      expect(getHealthResponse.status).toBe(200);
    });
  });
});
