export type HttpError = {
  message: string;
  errors?: string[];
};

export type HttpResult<TData, TError> =
  | {
      ok: true;
      data: TData;
    }
  | { ok: false; error: TError };
