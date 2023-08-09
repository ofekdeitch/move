type Nil = undefined | null;

export function isNil<T>(value: T | Nil): value is Nil {
  return value === undefined || value === null;
}
