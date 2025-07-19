import type { AuthInput, AuthResult } from 'cv-graphql';
import * as z from 'zod/v4';
import { type HttpError, type HttpResult } from '~/shared';
import { ClientError, graphQLClient } from './graphql.http.ts';
//TODO rename file to auth.http....
//TODO move somewhere for app error handling--------------
const errorSchema = z.object({
  message: z.string(),
  extensions: z.object({
    response: z.object({ message: z.string().array() }).optional(),
    exception: z.object({ message: z.string() }).optional(),
  }),
});

const errorResponseSchema = z.object({
  errors: errorSchema.array(),
});

const errorsSchema = errorResponseSchema.transform((data) => {
  return {
    errors: data.errors
      .map((e) => {
        if (e.extensions.exception) {
          return e.extensions.exception.message;
        }
        return e.extensions.response!.message;
      })
      .flatMap((m) => m),
  };
});
//  ----------------

export type AuthData = AuthResult;
export type AuthError = HttpError;
export type AuthResultType = HttpResult<AuthData, AuthError>;

type AuthResponseShape = { [key: string]: AuthResult };

export async function auth(
  query: string,
  operation: keyof AuthResponseShape,
  params: AuthInput
): Promise<AuthResultType> {
  try {
    const response = await graphQLClient.request<AuthResponseShape>(query, { auth: params });
    return { ok: true, data: response[operation] };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Request failed' } };
  }
}
