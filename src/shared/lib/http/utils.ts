import type { HttpError } from '~/shared/types';
import { StatusCodes } from './const';
import { ClientError } from './graphql.http';

export function getHandleResult<TData, TKey extends keyof TData>(key: TKey) {
  return (response: TData) => {
    return { ok: true as const, data: response[key] };
  };
}

export function getHandleException<TMessage extends string>(message: TMessage) {
  return (e: Error) => {
    if (e instanceof ClientError) {
      const errors = e.response.errors?.map((e) => e.message);
      return { ok: false as const, error: { message, errors } };
    }
    return { ok: false as const, error: { message } satisfies HttpError };
  };
}

export function handleAuthError(e: Error) {
  if (e instanceof ClientError) {
    if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
      return {
        ok: false as const,
        error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED },
      };
    }
  }

  throw e;
}
