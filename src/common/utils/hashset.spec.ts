import { HashSet, mergeHashSets } from './hashset';

describe('Utils / HashSet', () => {
  it('should not store the same value more than once', () => {
    const key = { a: 1 };
    const key2 = { a: 1 };

    const set = new HashSet();
    set.add(key);
    set.add(key2);

    expect(set.values()).toEqual([{ a: 1 }]);
  });

  it("should contain item after it's added", () => {
    const set = new HashSet();

    expect(set.contains({ a: 1 })).toBe(false);

    const key = { a: 1 };

    set.add(key);

    expect(set.contains({ a: 1 })).toBe(true);
  });

  it('should support initial entries', () => {
    const hashmap = new HashSet<InternationalId>([
      { passportNumber: 123456789, issuedBy: 'US' },
    ]);

    expect(
      hashmap.contains({ passportNumber: 123456789, issuedBy: 'US' }),
    ).toBeTruthy();
  });

  it('should copy', () => {
    const set = new HashSet([{ a: 1 }]);
    const copy = set.copy();

    expect(copy.contains({ a: 1 })).toBe(true);

    copy.add({ a: 2 });

    expect(set.contains({ a: 2 })).toBe(false);
  });

  it('should merge', () => {
    const set1 = new HashSet([{ a: 1 }]);
    const set2 = new HashSet([{ a: 2 }]);

    const merged = mergeHashSets(set1, set2);

    expect(set1.contains({ a: 1 })).toBe(true);
    expect(set2.contains({ a: 2 })).toBe(true);

    expect(merged.contains({ a: 1 })).toBe(true);
    expect(merged.contains({ a: 2 })).toBe(true);
  });
});

interface InternationalId {
  passportNumber: number;
  issuedBy: string;
}
