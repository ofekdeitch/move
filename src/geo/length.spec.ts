import { Length } from './length';

describe('Length', () => {
  it('should support meters', () => {
    expect(Length.meters(1).valueOf()).toBeLessThan(Length.meters(2).valueOf());
  });

  it('should convert cm to m', () => {
    expect(Length.centimeters(100).valueOf()).toBe(Length.meters(1).valueOf());
  });

  it('should convert km to m', () => {
    expect(Length.kilometers(1).valueOf()).toBe(Length.meters(1000).valueOf());
  });
});
