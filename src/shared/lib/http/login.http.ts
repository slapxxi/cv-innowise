import type { AuthResult } from 'cv-graphql';
import * as z from 'zod/v4';
import type { HttpError, HttpResult } from '~/shared';
import { ClientError, graphQLClient } from './graphql.http';

const LOGIN_QUERY = `
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      user {
        id
        email
      }
    }
  }
`;

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginData = AuthResult;
export type LoginError = HttpError;
export type LoginResult = HttpResult<LoginData, LoginError>;

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

export async function login(params: LoginParams): Promise<LoginResult> {
  try {
    const response = await graphQLClient.request<{ login: AuthResult }>(LOGIN_QUERY, { auth: params });
    return { ok: true, data: response.login };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Login failed' } };
  }
}
