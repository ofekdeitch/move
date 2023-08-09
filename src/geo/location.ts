import { RADIUS_OF_EARTH } from './consts';
import { Length } from './length';

export class GeoLocation {
  readonly y: number;
  readonly x: number;

  constructor(options: { y: number; x: number }) {
    this.y = options.y;
    this.x = options.x;
  }

  moveNorth(length: Length): GeoLocation {
    const diff = this.latitudeDiff(length);

    return new GeoLocation({
      x: this.x,
      y: this.y + diff,
    });
  }

  moveSouth(length: Length): GeoLocation {
    const diff = this.latitudeDiff(length);

    return new GeoLocation({
      x: this.x,
      y: this.y - diff,
    });
  }

  private latitudeDiff(length: Length): number {
    return (
      (length.toKilometers() / RADIUS_OF_EARTH.toKilometers()) * (180 / Math.PI)
    );
  }

  moveWest(length: Length): GeoLocation {
    const diff = this.longitudeDiff(length);

    return new GeoLocation({
      x: this.x - diff,
      y: this.y,
    });
  }

  moveEast(length: Length): GeoLocation {
    const diff = this.longitudeDiff(length);

    return new GeoLocation({
      x: this.x + diff,
      y: this.y,
    });
  }

  private longitudeDiff(length: Length): number {
    return (
      ((length.toKilometers() / RADIUS_OF_EARTH.toKilometers()) *
        (180 / Math.PI)) /
      Math.cos(this.y * (Math.PI / 180))
    );
  }

  getDistanceFrom(other: GeoLocation): Length {
    const lat1 = this.y;
    const lon1 = this.x;
    const lat2 = other.y;
    const lon2 = other.x;

    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const lat1Radian = toRad(lat1);
    const lat2Radian = toRad(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
        Math.sin(dLon / 2) *
        Math.cos(lat1Radian) *
        Math.cos(lat2Radian);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return Length.kilometers(d);
  }
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}
