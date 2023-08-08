import {
  countByValue,
  groupBy,
  sortAsc,
  sortDesc,
  take,
} from './array.utils';

describe('Array Utils / sortDesc', () => {
  it('should sort', () => {
    const input: User[] = [
      { name: 'John', age: 20 },
      { name: 'Jane', age: 30 },
      { name: 'Bob', age: 5 },
    ];

    expect(sortDesc(input, (user) => user.age)).toEqual([
      { name: 'Jane', age: 30 },
      { name: 'John', age: 20 },
      { name: 'Bob', age: 5 },
    ]);
  });
});

describe('Array Utils / sortAsc', () => {
  it('should sort', () => {
    const input: User[] = [
      { name: 'John', age: 20 },
      { name: 'Jane', age: 30 },
      { name: 'Bob', age: 5 },
    ];

    expect(sortAsc(input, (user) => user.age)).toEqual([
      { name: 'Bob', age: 5 },
      { name: 'John', age: 20 },
      { name: 'Jane', age: 30 },
    ]);
  });
});

interface User {
  name: string;
  age: number;
}

describe('Array Utils / groupByValue', () => {
  it('should group by value', () => {
    const cat = {
      name: 'cat',
      isKosher: false,
    };
    const dog = {
      name: 'dog',
      isKosher: false,
    };
    const pig = {
      name: 'pig',
      isKosher: false,
    };
    const cow = {
      name: 'cow',
      isKosher: true,
    };
    const chicken = {
      name: 'chicken',
      isKosher: true,
    };
    const animals: Animal[] = [cat, pig, cow, chicken, dog];

    const groups = groupBy(animals, (animal) => animal.isKosher);
    const kosherAnimals = groups.get(true) ?? [];
    const nonKosherAnimals = groups.get(false) ?? [];

    expect(kosherAnimals).toHaveLength(2);
    expect(nonKosherAnimals).toHaveLength(3);

    expect(kosherAnimals).toContainEqual(cow);
    expect(kosherAnimals).toContainEqual(chicken);

    expect(nonKosherAnimals).toContainEqual(cat);
    expect(nonKosherAnimals).toContainEqual(dog);
    expect(nonKosherAnimals).toContainEqual(pig);
  });
});

describe('Array Utils / countByValue', () => {
  it('should count by value', () => {
    const cat = {
      name: 'cat',
      isKosher: false,
    };
    const dog = {
      name: 'dog',
      isKosher: false,
    };
    const pig = {
      name: 'pig',
      isKosher: false,
    };
    const cow = {
      name: 'cow',
      isKosher: true,
    };
    const chicken = {
      name: 'chicken',
      isKosher: true,
    };
    const animals: Animal[] = [cat, pig, cow, chicken, dog];

    const counters = countByValue(animals, (animal) => animal.isKosher);
    const kosherAnimals = counters.get(true) ?? 0;
    const nonKosherAnimals = counters.get(false) ?? 0;

    expect(kosherAnimals).toEqual(2);
    expect(nonKosherAnimals).toEqual(3);
  });
});

interface Animal {
  name: string;
  isKosher: boolean;
}

describe('Array Utils / take', () => {
  describe('when array is empty', () => {
    it('should return empty array', () => {
      expect(take([], 5)).toEqual([]);
    });
  });

  describe('when array contains less than n elements', () => {
    it('should return all elements', () => {
      expect(take([1, 2, 3], 5)).toEqual([1, 2, 3]);
    });
  });

  describe('when array contains more than n elements', () => {
    it('should return first n elements', () => {
      const originalArray = [1, 2, 3, 4, 5];
      expect(take(originalArray, 3)).toEqual([1, 2, 3]);
      expect(originalArray).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
