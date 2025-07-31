import { createComparator } from '../create-comparator-fn.util';

type Item = {
  name: string;
  age: number;
};

describe('createComparator', () => {
  const getValue = <T, S extends keyof T>(item: T, key: S) => item[key];

  const items: Item[] = [
    { name: ' Alice ', age: 30 },
    { name: 'bob', age: 25 },
    { name: '', age: 40 },
    { name: 'Charlie', age: 20 },
  ];

  describe('string comparisons', () => {
    it('sorts by name ascending, trims strings, skips empty last', () => {
      const comparator = createComparator<Item, 'name'>('name', 'asc', getValue);
      const sorted = [...items].sort(comparator);
      expect(sorted.map((i) => i.name.trim())).toEqual(['Alice', 'bob', 'Charlie', '']);
    });

    it('sorts by name descending, trims strings, skips empty first', () => {
      const comparator = createComparator<Item, 'name'>('name', 'desc', getValue);
      const sorted = [...items].sort(comparator);
      expect(sorted.map((i) => i.name.trim())).toEqual(['', 'Charlie', 'bob', 'Alice']);
    });
  });

  describe('number comparisons', () => {
    it('sorts by age ascending', () => {
      const comparator = createComparator<Item, 'age'>('age', 'asc', getValue);
      const sorted = [...items].sort(comparator);
      expect(sorted.map((i) => i.age)).toEqual([20, 25, 30, 40]);
    });

    it('sorts by age descending', () => {
      const comparator = createComparator<Item, 'age'>('age', 'desc', getValue);
      const sorted = [...items].sort(comparator);
      expect(sorted.map((i) => i.age)).toEqual([40, 30, 25, 20]);
    });
  });

  describe('edge cases', () => {
    it('treats identical values as equal', () => {
      const identicalItems = [
        { name: 'same', age: 10 },
        { name: 'same', age: 10 },
      ];
      const comparator = createComparator<Item, 'name'>('name', 'asc', getValue);
      const sorted = [...identicalItems].sort(comparator);
      expect(sorted).toEqual(identicalItems);
    });

    it('handles mixed types gracefully', () => {
      const mixedItems = [
        { name: 'alpha', age: 42 as unknown as any }, // forcing type pollution
        { name: 'beta', age: '42' as unknown as any },
      ];
      const comparator = createComparator<(typeof mixedItems)[0], 'age'>('age', 'asc', getValue);
      expect(() => mixedItems.sort(comparator)).not.toThrow();
    });
  });
});
