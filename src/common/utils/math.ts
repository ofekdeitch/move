export function limitPrecision(value: number, precision: number) {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}
