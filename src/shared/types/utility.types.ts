export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Nullable<T> = T | null;

export type Result<TData, TErr> =
  | {
      ok: true;
      data: TData;
    }
  | { ok: false; error: TErr };

export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

export type SnakeToCamelCaseNested<T> = T extends object
  ? {
      [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<T[K]>;
    }
  : T;

// remove undefined type from union
export type NonUndefined<T> = T extends undefined ? never : T;
