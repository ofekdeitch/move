import { TestDriver } from '../driver';
import { Length, GeoLocation } from '../../geo';
import { GetHeatmapResponse } from 'src/heatmap/dto';

describe('Heatmap', () => {
  const driver = new TestDriver();

  afterEach(async () => {
    await driver.clearState();
  });

  describe('when 2 samples exists with a 5 meters distance', () => {
    it('should aggregate them to a single point', async () => {
      // ARRAMGE

      const long1 = 32.072079;
      const lat1 = 34.77933;

      const location1 = new GeoLocation({ x: long1, y: lat1 });
      const location2 = location1.moveWest(Length.meters(5));

      driver.createSample({
        longitude: location1.x,
        latitude: location1.y,
      });
      driver.createSample({
        longitude: location2.x,
        latitude: location2.y,
      });

      await driver.start();

      // ACT
      const getHeatmapResponse = await driver.request.get('/heatmap');
      expect(getHeatmapResponse.status).toBe(200);

      // ASSERT
      const actualBody = getHeatmapResponse.body as GetHeatmapResponse;
      expect(actualBody.points).toHaveLength(1);

      const actualPoint = actualBody.points[0];
      expect(actualPoint.value).toBe(2);

      const actualPointLocation = new GeoLocation({
        x: actualPoint.location.longitude,
        y: actualPoint.location.latitude,
      });
      expect(
        actualPointLocation.getDistanceFrom(location1).toMeters(),
      ).toBeLessThan(30);
      expect(
        actualPointLocation.getDistanceFrom(location2).toMeters(),
      ).toBeLessThan(30);
    });
  });

  describe('when 2 samples exists together and another one a little far away', () => {
    it('should not group all of them together', async () => {
      // ARRAMGE

      const long1 = 32.072079;
      const lat1 = 34.77933;

      const location1 = new GeoLocation({ x: long1, y: lat1 });
      const location2 = location1.moveWest(Length.meters(5));
      const location3 = location1.moveNorth(Length.meters(100));

      driver.createSample({
        longitude: location1.x,
        latitude: location1.y,
      });
      driver.createSample({
        longitude: location2.x,
        latitude: location2.y,
      });
      driver.createSample({
        longitude: location3.x,
        latitude: location3.y,
      });

      await driver.start();

      // ACT
      const getHeatmapResponse = await driver.request.get('/heatmap');
      expect(getHeatmapResponse.status).toBe(200);

      // ASSERT
      const actualBody = getHeatmapResponse.body as GetHeatmapResponse;
      expect(actualBody.points).toHaveLength(2);

      const actualPoint = actualBody.points[0];
      expect(actualPoint.value).toBe(2);

      const actualPointLocation = new GeoLocation({
        x: actualPoint.location.longitude,
        y: actualPoint.location.latitude,
      });
      expect(
        actualPointLocation.getDistanceFrom(location1).toMeters(),
      ).toBeLessThan(30);
      expect(
        actualPointLocation.getDistanceFrom(location2).toMeters(),
      ).toBeLessThan(30);
    });
  });
});
