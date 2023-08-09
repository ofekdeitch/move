export class Length {
  private $meters: number;

  private constructor(meters: number) {
    this.$meters = meters;
  }

  static centimeters(centimeters: number): Length {
    return new Length(centimeters / 100);
  }

  static meters(meters: number): Length {
    return new Length(meters);
  }

  static kilometers(kilometers: number): Length {
    return new Length(kilometers * 1000);
  }

  toMeters(): number {
    return this.$meters;
  }

  toKilometers(): number {
    return this.$meters / 1000;
  }

  valueOf(): number {
    return this.$meters;
  }
}
