export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Result<TData, TErr> =
  | {
      ok: true;
      data: TData;
    }
  | { ok: false; error: TErr };
