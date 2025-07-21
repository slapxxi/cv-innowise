import type { AuthResult, HttpError, HttpResult } from '~/shared';
import { ClientError, gql, unAuthClient } from './graphql.http';
import { errorsSchema } from './schema';
import { QUERIES } from './queries';

const LOGIN_QUERY = gql`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      refresh_token
      user {
        ${QUERIES.USER_QUERY}
      }
    }
  }
`;

type LoginQueryResult = {
  login: AuthResult;
};

export type LoginData = LoginQueryResult['login'];

export type LoginError = HttpError;

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResult = HttpResult<LoginData, LoginError>;

export async function login(params: LoginParams): Promise<LoginResult> {
  try {
    const response = await unAuthClient.request<LoginQueryResult>(LOGIN_QUERY, { auth: params });
    // const response = await unAuthClient.request<{ login: AuthResult }>(LOGIN_QUERY, { auth: params });
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
