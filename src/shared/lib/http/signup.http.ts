import type { AuthResult } from 'cv-graphql';
import * as z from 'zod/v4';
import type { HttpError, HttpResult } from '~/shared';
import { ClientError, gql, unAuthClient } from './graphql.http';

const SIGNUP_QUERY = gql`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      user {
        id
        email
      }
      access_token
      refresh_token
    }
  }
`;

export type SignupParams = {
  email: string;
  password: string;
};

export type SignupData = AuthResult;
export type SignupError = HttpError;
export type SignupResult = HttpResult<SignupData, SignupError>;

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

export async function signup(params: SignupParams): Promise<SignupResult> {
  try {
    const response = await unAuthClient.request<{ signup: AuthResult }>(SIGNUP_QUERY, { auth: params });
    return { ok: true, data: response.signup };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Signup failed' } };
  }
}
