import { Length } from './length';
import { GeoLocation } from './location';

describe('Geo', () => {
  describe('moveNorth', () => {
    it('should calculate the new latitude correctly', () => {
      const initial = new GeoLocation({
        y: 32.063034,
        x: 34.779283,
      });

      const expected = new GeoLocation({
        y: 32.072054,
        x: 34.779283,
      });

      const actual = initial.moveNorth(Length.kilometers(1));
      const distance = actual.getDistanceFrom(expected);

      expect(distance.toMeters()).toBeLessThan(5);
    });
  });

  describe('moveSouth', () => {
    it('should calculate the new latitude correctly', () => {
      const initial = new GeoLocation({
        y: 32.072054,
        x: 34.779283,
      });

      const expected = new GeoLocation({
        y: 32.063034,
        x: 34.779283,
      });

      const actual = initial.moveSouth(Length.kilometers(1));

      expect(actual.getDistanceFrom(expected).toMeters()).toBeLessThan(5);
      expect(expected.getDistanceFrom(actual).toMeters()).toBeLessThan(5);
    });
  });

  describe('moveWest', () => {
    it('should calculate the new latitude correctly', () => {
      const initial = new GeoLocation({
        y: 32.071971,
        x: 34.789937,
      });

      const expected = new GeoLocation({
        y: 32.071971,
        x: 34.779283,
      });

      const actual = initial.moveWest(Length.kilometers(1));

      expect(actual.getDistanceFrom(expected).toMeters()).toBeLessThan(5);
      expect(expected.getDistanceFrom(actual).toMeters()).toBeLessThan(5);
    });

    it('should calculate the new latitude correctly when given a small distance', () => {
      const initial = new GeoLocation({
        y: 32.071971,
        x: 34.790471,
      });

      const expected = new GeoLocation({
        y: 32.071971,
        x: 34.789937,
      });

      const actual = initial.moveWest(Length.meters(50));

      expect(actual.getDistanceFrom(expected).toMeters()).toBeLessThan(5);
      expect(expected.getDistanceFrom(actual).toMeters()).toBeLessThan(5);
    });
  });

  describe('moveEast', () => {
    it('should calculate the new latitude correctly', () => {
      const initial = new GeoLocation({
        y: 32.071971,
        x: 34.779283,
      });

      const expected = new GeoLocation({
        y: 32.071971,
        x: 34.789937,
      });

      const actual = initial.moveEast(Length.kilometers(1));

      expect(actual.getDistanceFrom(expected).toMeters()).toBeLessThan(5);
      expect(expected.getDistanceFrom(actual).toMeters()).toBeLessThan(5);
    });

    it('should calculate the new latitude correctly when given a small distance', () => {
      const initial = new GeoLocation({
        y: 32.071971,
        x: 34.789937,
      });

      const expected = new GeoLocation({
        y: 32.071971,
        x: 34.790471,
      });

      const actual = initial.moveEast(Length.meters(50));

      expect(actual.getDistanceFrom(expected).toMeters()).toBeLessThan(5);
      expect(expected.getDistanceFrom(actual).toMeters()).toBeLessThan(5);
    });
  });

  describe('moved diagonally', () => {
    it('should calculate the new latitude correctly', () => {
      const initial = new GeoLocation({
        y: 32.071971,
        x: 34.789937,
      });

      const movedToNorthWest = initial
        .moveNorth(Length.kilometers(3))
        .moveWest(Length.kilometers(4));

      const distance = initial.getDistanceFrom(movedToNorthWest).toMeters();

      expect(distance).toBeLessThan(5005);
      expect(distance).toBeGreaterThan(4995);
    });
  });

  describe('moved around', () => {
    it('should go back to the same place', () => {
      const initial = new GeoLocation({
        y: 32.071971,
        x: 34.789937,
      });

      const oneKilometer = Length.kilometers(1);

      const movedAround = initial
        .moveEast(oneKilometer)
        .moveNorth(oneKilometer)
        .moveWest(oneKilometer)
        .moveSouth(oneKilometer);

      expect(initial.getDistanceFrom(movedAround).toMeters()).toBeLessThan(5);
    });
  });
});
