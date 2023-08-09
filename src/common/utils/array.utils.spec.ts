import { countByValue, groupBy } from './array.utils';

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
