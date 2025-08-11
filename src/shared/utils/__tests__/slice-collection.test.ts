import { sliceCollection } from '../slice-collection.util';

describe('sliceCollection', () => {
  const collection = Array.from({ length: 100 }, (_, i) => i + 1); // [1, 2, ..., 100]

  it('returns first page with default behavior', () => {
    const result = sliceCollection(collection, { page: 1, limit: 10 });
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('returns second page with limit 10', () => {
    const result = sliceCollection(collection, { page: 2, limit: 10 });
    expect(result).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('returns last items if page is near the end', () => {
    const result = sliceCollection(collection, { page: 10, limit: 10 });
    expect(result).toEqual([91, 92, 93, 94, 95, 96, 97, 98, 99, 100]);
  });

  it('returns empty array if page is out of range', () => {
    const result = sliceCollection(collection, { page: 999, limit: 10 });
    expect(result).toEqual([]);
  });

  it('forces minimum page = 1', () => {
    const result = sliceCollection(collection, { page: 0, limit: 10 });
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('forces minimum limit = 1', () => {
    const result = sliceCollection(collection, { page: 2, limit: 0 });
    expect(result).toEqual([2]);
  });

  it('returns whole collection if limit is very large', () => {
    const result = sliceCollection(collection, { page: 1, limit: 1000 });
    expect(result).toEqual(collection);
  });

  it('works with small collections', () => {
    const small = [1, 2, 3];
    const result = sliceCollection(small, { page: 1, limit: 2 });
    expect(result).toEqual([1, 2]);
  });

  it('returns empty array for empty collection', () => {
    const result = sliceCollection([], { page: 1, limit: 10 });
    expect(result).toEqual([]);
  });
});
