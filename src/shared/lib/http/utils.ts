import { StatusCodes } from './const';
import { ClientError } from './graphql.http';

export function getHandleResult<TData, TKey extends keyof TData>(key: TKey) {
  return (response: TData) => {
    return { ok: true as const, data: response[key] };
  };
}

export function getHandleException<TMessage extends string>(message: TMessage) {
  return () => {
    return { ok: false as const, error: { message } };
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
