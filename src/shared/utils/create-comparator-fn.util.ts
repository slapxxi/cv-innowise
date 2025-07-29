export function createComparator<T, S extends string>(
  sort: S,
  order: 'asc' | 'desc',
  getValue: (item: T, key: S) => unknown
) {
  return (a: T, b: T) => {
    const isAsc = order === 'asc';
    const valA = getValue(a, sort);
    const valB = getValue(b, sort);

    if (typeof valA === 'string' && typeof valB === 'string') {
      if (valA === '') return isAsc ? 1 : -1;
      if (valB === '') return isAsc ? -1 : 1;

      const comparison = valA.trim().localeCompare(valB.trim());
      return isAsc ? comparison : -comparison;
    }

    // @ts-expect-error expected
    if (valA < valB) return isAsc ? -1 : 1;
    // @ts-expect-error expected
    if (valA > valB) return isAsc ? 1 : -1;

    return 0;
  };
}
