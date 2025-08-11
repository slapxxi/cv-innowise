type Params = {
  page: number;
  limit: number;
};

export function sliceCollection<T>(collection: T[], { page, limit }: Params) {
  const l = Math.max(1, limit);
  const p = Math.max(1, page);
  return collection.slice((p - 1) * l, p * l);
}
