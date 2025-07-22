import type { AuthResponse, HttpError, HttpResult, User } from '~/shared';
import { ClientError, gql, request } from './graphql.http';
import { errorsSchema } from './schema';
import { Queries } from './queries';
import { API_URL } from './const';

const LOGIN_QUERY = gql`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token 
      refresh_token
      user {
        ${Queries.USER_QUERY}
      }
    }
  }
`;

type LoginQueryResult = {
  login: AuthResponse;
};

export type LoginData = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type LoginError = HttpError;

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResult = HttpResult<LoginData, LoginError>;

export async function login(params: LoginParams): Promise<LoginResult> {
  try {
    const response = await request<LoginQueryResult>({
      url: API_URL,
      document: LOGIN_QUERY,
      variables: { auth: params },
    });
    const { access_token, refresh_token, user } = response.login;
    return { ok: true, data: { accessToken: access_token, refreshToken: refresh_token, user } };
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
