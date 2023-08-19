import { HashMap } from '@jocular/collections';

export class HashSet<T> {
  private map: HashMap<T, boolean> = new HashMap<T, boolean>();

  constructor(values?: T[]) {
    if (values) {
      for (const value of values) {
        this.add(value);
      }
    }
  }

  add(value: T): void {
    this.map.set(value, true);
  }

  values(): T[] {
    return this.map.keys();
  }

  contains(value: T): boolean {
    return this.map.get(value) === true;
  }

  copy(): HashSet<T> {
    const copy = new HashSet<T>();
    copy.map = this.map.copy();
    return copy;
  }
}

export function toHashSet<V, K>(
  values: V[],
  getKey: (val: V) => K,
): HashSet<K> {
  const set = new HashSet<K>();

  for (const val of values) {
    const key = getKey(val);
    set.add(key);
  }

  return set;
}

export function mergeHashSets<T>(
  set1: HashSet<T>,
  set2: HashSet<T>,
): HashSet<T> {
  const set = set1.copy();

  for (const value of set2.values()) {
    set.add(value);
  }

  return set;
}
