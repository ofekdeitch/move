import { TestDriver } from '../driver';
import { Length, GeoLocation } from '../../geo';
import { GetHeatmapResponse, HeatmapPoint } from 'src/heatmap/dto';

describe('Heatmap', () => {
  const driver = new TestDriver();

  afterEach(async () => {
    await driver.clearState();
  });

  afterAll(async () => {
    await driver.stop();
  });

  describe('when 2 samples exists with a 5 meters distance', () => {
    it('should aggregate them to a single point', async () => {
      // ARRAMGE

      const long1 = 34.77933;
      const lat1 = 32.072079;

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

      const actualPointLocation = toGeoLocation(actualPoint);

      assertNotFurtherThan({
        locations: [location1, actualPointLocation],
        maxDistance: Length.meters(30),
      });
      assertNotFurtherThan({
        locations: [location2, actualPointLocation],
        maxDistance: Length.meters(30),
      });
    });
  });

  describe('when 2 samples exists together and another one a little far away', () => {
    it('should not group all of them together', async () => {
      // ARRAMGE

      const long1 = 34.77933;
      const lat1 = 32.072079;

      const location1 = new GeoLocation({ x: long1, y: lat1 });
      const location2 = location1.moveWest(Length.meters(5));
      const location3 = location1.moveNorth(Length.meters(50));

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

      const groupedPoint = actualBody.points.find((p) => p.value === 2);
      const ungroupedPoint = actualBody.points.find((p) => p.value === 1);

      expect(groupedPoint).not.toBeUndefined();
      expect(ungroupedPoint).not.toBeUndefined();

      const groupedPointLocation = toGeoLocation(groupedPoint);

      assertNotFurtherThan({
        locations: [location1, groupedPointLocation],
        maxDistance: Length.meters(30),
      });
      assertNotFurtherThan({
        locations: [location2, groupedPointLocation],
        maxDistance: Length.meters(30),
      });

      const ungroupedPointLocation = toGeoLocation(ungroupedPoint);

      assertNotFurtherThan({
        locations: [location3, ungroupedPointLocation],
        maxDistance: Length.meters(30),
      });
    });
  });
});

interface NotFurtherThanParams {
  locations: GeoLocation[];
  maxDistance: Length;
}

function assertNotFurtherThan(params: NotFurtherThanParams) {
  const [location1, location2] = params.locations;
  const distance = location1.getDistanceFrom(location2);
  expect(distance.toMeters()).toBeLessThan(params.maxDistance.toMeters());
}

function toGeoLocation(point: HeatmapPoint): GeoLocation {
  return new GeoLocation({
    x: point.location.longitude,
    y: point.location.latitude,
  });
}
