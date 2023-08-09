import * as farmhash from 'farmhash';
import * as deepEqual from 'deep-equal';
import * as stableStringify from 'json-stable-stringify';

export class HashMap<K, V> {
  private buckets: Record<string, Bucket<K, V>> = {};

  constructor(entries?: Tuple<K, V>[]) {
    if (entries) {
      for (const entry of entries) {
        this.set(entry.key, entry.value);
      }
    }
  }

  set(key: K, value: V) {
    const slot = this.getSlot(key);
    const bucket = this.getBucket(key);

    if (bucket) {
      this.appendToBucket(bucket, key, value);
    } else {
      this.buckets[slot] = [{ key, value }];
    }
  }

  get(key: K): V | null {
    const bucket = this.getBucket(key);

    if (!bucket) {
      return null;
    }

    const value = this.findInBucket(bucket, key);
    return value;
  }

  keys(): K[] {
    const keys: K[] = [];

    for (const bucket of Object.values(this.buckets)) {
      for (const tuple of bucket) {
        keys.push(tuple.key);
      }
    }

    return keys;
  }

  values(): V[] {
    const values: V[] = [];

    for (const bucket of Object.values(this.buckets)) {
      for (const tuple of bucket) {
        values.push(tuple.value);
      }
    }

    return values;
  }

  entries(): [K, V][] {
    const values: [K, V][] = [];

    for (const bucket of Object.values(this.buckets)) {
      for (const tuple of bucket) {
        values.push([tuple.key, tuple.value]);
      }
    }

    return values;
  }

  private getBucket(key: K): Bucket<K, V> | null {
    const slot = this.getSlot(key);
    const bucket = this.buckets[slot];

    if (bucket) {
      return bucket;
    }

    return null;
  }

  private getSlot(key: K): number {
    return farmhash.hash32(stableStringify(key));
  }

  private deepEqual(a: any, b: any): boolean {
    return deepEqual(a, b);
  }

  private findInBucket(bucket: Bucket<K, V>, key: K): V | null {
    const tuple = bucket.find((tuple) => this.deepEqual(tuple.key, key));
    return tuple?.value ?? null;
  }

  private appendToBucket(bucket: Bucket<K, V>, key: K, value: V): void {
    const index = bucket.findIndex((tuple) => this.deepEqual(tuple.key, key));

    if (index >= 0) {
      bucket[index].value = value;
    } else {
      bucket.push({ key, value });
    }
  }

  delete(key: K) {
    const bucket = this.getBucket(key);

    if (!bucket) {
      return;
    }

    const index = bucket.findIndex((tuple) => this.deepEqual(tuple.key, key));
    bucket.splice(index, 1);
  }

  copy(): HashMap<K, V> {
    const newMap = new HashMap<K, V>();

    for (const slot of Object.keys(this.buckets)) {
      const bucket = this.buckets[slot];
      const newBucket: Bucket<K, V> = [];

      bucket.forEach((tuple) => {
        newBucket.push({ ...tuple });
      });

      newMap.buckets[slot] = newBucket;
    }

    return newMap;
  }
}

interface Tuple<K, V> {
  key: K;
  value: V;
}

type Bucket<K, V> = Tuple<K, V>[];

export function toMap<T, K>(values: T[], getKey: (val: T) => K): HashMap<K, T> {
  const map = new HashMap<K, T>();

  for (const val of values) {
    const key = getKey(val);
    map.set(key, val);
  }

  return map;
}

export function mergeHashMaps<K, V>(
  map1: HashMap<K, V>,
  map2: HashMap<K, V>,
  onConflict: OnConflictCallback<V>,
): HashMap<K, V> {
  const map = map1.copy();

  for (const [key, value] of map2.entries()) {
    const existingEntry = map.get(key);

    if (existingEntry) {
      map.set(key, onConflict(existingEntry, value));
    } else {
      map.set(key, value);
    }
  }

  return map;
}

type OnConflictCallback<V> = (value1: V, value2: V) => V;
