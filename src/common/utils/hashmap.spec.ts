import { faker } from '@faker-js/faker';
import { HashMap, mergeHashMaps } from './hashmap';

describe('Hashmap', () => {
  it('should return a value when a key is set', () => {
    const map = new HashMap<InternationalId, Person>();

    const person1 = { id: '1', name: 'John' };
    const person1InternationalId = {
      passportNumber: 123456789,
      issuedBy: 'US',
    };

    const person2 = { id: '5', name: 'Bob' };
    const person2InternationalId = {
      passportNumber: 64564524,
      issuedBy: 'UK',
    };

    map.set(person1InternationalId, person1);
    map.set(person2InternationalId, person2);

    expect(map.get(person1InternationalId)).toEqual(person1);
    expect(map.get(person2InternationalId)).toEqual(person2);
  });

  it('should override a value when a key is set twice', () => {
    const map = new HashMap<InternationalId, Person>();

    const person1 = { id: '1', name: 'John' };
    const person1InternationalId = {
      passportNumber: 123456789,
      issuedBy: 'US',
    };

    const person1Updated = { id: '1', name: 'Bob' };

    map.set(person1InternationalId, person1);
    map.set(person1InternationalId, person1Updated);

    expect(map.get(person1InternationalId)).toEqual(person1Updated);
  });

  it('should return null when the value does not exist', () => {
    const map = new HashMap<InternationalId, Person>();

    const nonExistantKey = {
      passportNumber: 123456789,
      issuedBy: 'US',
    };

    expect(map.get(nonExistantKey)).toEqual(null);
  });

  it('should return its keys', () => {
    const map = new HashMap<InternationalId, Person>();

    const person1 = { id: '1', name: 'John' };
    const person1InternationalId = {
      passportNumber: 123456789,
      issuedBy: 'US',
    };

    const person2 = { id: '5', name: 'Bob' };
    const person2InternationalId = {
      passportNumber: 64564524,
      issuedBy: 'UK',
    };

    map.set(person1InternationalId, person1);
    map.set(person1InternationalId, person1);
    map.set(person1InternationalId, person1);
    map.set(person1InternationalId, person1);
    map.set(person2InternationalId, person2);
    map.set(person2InternationalId, person2);
    map.set(person2InternationalId, person2);
    map.set(person2InternationalId, person2);

    const actualKeys = map.keys();
    expect(actualKeys).toHaveLength(2);
    expect(actualKeys).toContain(person1InternationalId);
    expect(actualKeys).toContain(person2InternationalId);
  });

  it('should support many values', () => {
    const n = 100000;

    const tuples: Tuple<InternationalId, Person>[] = [];
    const hashmap = new HashMap<InternationalId, Person>();

    for (let i = 0; i < n; i++) {
      const internationalId: InternationalId = {
        passportNumber: faker.datatype.number({ min: 0, max: 1000000000 }),
        issuedBy: faker.lorem.words(),
      };
      const person: Person = {
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
      };

      tuples.push({ key: internationalId, value: person });
      hashmap.set(internationalId, person);
    }

    expect(hashmap.keys()).toHaveLength(n);
    expect(hashmap.values()).toHaveLength(n);

    for (const tuple of tuples) {
      expect(hashmap.get(tuple.key)).toEqual(tuple.value);
    }
  });

  it('should serialize keys, regardless of the order of their properties', () => {
    const map = new HashMap<InternationalId, boolean>();
    const passportNumber = faker.datatype.number({ min: 0, max: 1000000000 });
    const issuedBy = faker.address.countryCode();

    map.set({ passportNumber, issuedBy }, true);

    expect(map.get({ passportNumber, issuedBy })).toEqual(true);
    expect(map.get({ issuedBy, passportNumber })).toEqual(true);
  });

  it('should support initial entries', () => {
    const hashmap = new HashMap<InternationalId, Person>([
      {
        key: { passportNumber: 123456789, issuedBy: 'US' },
        value: { id: '1', name: 'John' },
      },
    ]);

    expect(hashmap.get({ passportNumber: 123456789, issuedBy: 'US' })).toEqual({
      id: '1',
      name: 'John',
    });
  });

  it('should support entries()', () => {
    const map = new HashMap<InternationalId, Person>();

    const person1 = { id: '1', name: 'John' };
    const person1InternationalId = {
      passportNumber: 123456789,
      issuedBy: 'US',
    };

    const person2 = { id: '5', name: 'Bob' };
    const person2InternationalId = {
      passportNumber: 64564524,
      issuedBy: 'UK',
    };

    map.set(person1InternationalId, person1);
    map.set(person2InternationalId, person2);

    const entries = map.entries();

    expect(entries).toHaveLength(2);

    const person1Entry = entries.find(
      ([key]) => key === person1InternationalId,
    );
    expect(person1Entry).toEqual([person1InternationalId, person1]);

    const person2Entry = entries.find(
      ([key]) => key === person2InternationalId,
    );
    expect(person2Entry).toEqual([person2InternationalId, person2]);
  });

  it('should delete keys', () => {
    const map = new HashMap<string, string>();

    const key = faker.datatype.uuid();
    const value = faker.datatype.uuid();

    map.set(key, value);

    expect(map.get(key)).toEqual(value);

    map.delete(key);

    expect(map.get(key)).toEqual(null);
  });

  it('should copy', () => {
    const map = new HashMap<string, string>();

    const key = faker.datatype.uuid();
    const value = faker.datatype.uuid();

    map.set(key, value);

    expect(map.get(key)).toEqual(value);

    const copy = map.copy();

    expect(copy.get(key)).toEqual(value);

    const newValue = faker.datatype.uuid();
    copy.set(key, newValue);

    expect(map.get(key)).toEqual(value);
    expect(copy.get(key)).toEqual(newValue);
  });

  it('should merge', () => {
    const map1 = new HashMap<string, number>();
    const map2 = new HashMap<string, number>();

    const key1 = faker.datatype.uuid();
    const value1 = faker.datatype.number();

    const key2 = faker.datatype.uuid();
    const value2 = faker.datatype.number();

    const mutualKey = faker.datatype.uuid();
    const mutualValue1 = faker.datatype.number();
    const mutualValue2 = faker.datatype.number();

    map1.set(key1, value1);
    map1.set(mutualKey, mutualValue1);
    map2.set(key2, value2);
    map2.set(mutualKey, mutualValue2);

    const merged = mergeHashMaps(map1, map2, (v1, v2) => v1 + v2);

    expect(merged.get(key1)).toEqual(value1);
    expect(merged.get(key2)).toEqual(value2);
    expect(merged.get(mutualKey)).toEqual(mutualValue1 + mutualValue2);
  });
});

interface InternationalId {
  passportNumber: number;
  issuedBy: string;
}

interface Person {
  id: string;
  name: string;
}

interface Tuple<K, V> {
  key: K;
  value: V;
}
