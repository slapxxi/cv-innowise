import { sliceCollection } from '../slice-collection.util';

describe('sliceCollection', () => {
  let collection: number[];

  beforeEach(() => {
    collection = new Array(100).fill(0).map((_, i) => i + 1);
  });

  test('returns collection slice based on page and limit inputs', () => {
    let result = sliceCollection(collection, { page: 1, limit: 5 });
    expect(result).toEqual([1, 2, 3, 4, 5]);

    result = sliceCollection(collection, { page: 2, limit: 5 });
    expect(result).toEqual([6, 7, 8, 9, 10]);

    result = sliceCollection(collection, { page: 2, limit: 10 });
    expect(result).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  test('negative limit defaults to 1', () => {
    const result = sliceCollection(collection, { page: 1, limit: -5 });
    expect(result).toEqual([1]);
  });

  test('0 limit defaults to 1', () => {
    const result = sliceCollection(collection, { page: 1, limit: 0 });
    expect(result).toEqual([1]);
  });

  test('negative page defaults to 1', () => {
    const result = sliceCollection(collection, { page: -1, limit: 5 });
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  test('0 page defaults to 1', () => {
    const result = sliceCollection(collection, { page: 0, limit: 5 });
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });
});
