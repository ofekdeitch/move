import { HashMap } from './hashmap';

export function groupBy<T, K>(
  array: T[],
  getter: (item: T) => K,
): HashMap<K, T[]> {
  return array.reduce((result, currentValue) => {
    const key = getter(currentValue);
    const group = result.get(key) ?? [];
    group.push(currentValue);

    result.set(key, group);
    return result;
  }, new HashMap<K, T[]>());
}

export function countByValue<T, K>(
  array: T[],
  getter: (item: T) => K,
): HashMap<K, number> {
  const groupedByValue = groupBy(array, getter);
  const countedByValue = new HashMap<K, number>();

  for (const key of groupedByValue.keys()) {
    const value = groupedByValue.get(key) ?? [];
    countedByValue.set(key, value.length);
  }

  return countedByValue;
}

export const partitionArray = <T>(
  array: T[],
  isValid: (element: T) => boolean,
) => {
  return array.reduce(
    (partitionedArrays, elem) => {
      return isValid(elem)
        ? {
            valid: [...partitionedArrays.valid, elem],
            invalid: partitionedArrays.invalid,
          }
        : {
            valid: partitionedArrays.valid,
            invalid: [...partitionedArrays.invalid, elem],
          };
    },
    { valid: [] as T[], invalid: [] as T[] },
  );
};

export const getUniqueBy = <T, K, V>(
  arr: T[],
  getKey: (val: T) => K,
  getValue: (val: T) => V,
) => {
  const res: HashMap<K, V> = new HashMap();

  for (const item of arr) {
    const key = getKey(item);
    const value = getValue(item);

    res.set(key, value);
  }

  return res.values();
};
