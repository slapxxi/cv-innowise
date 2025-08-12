import type { AuthResponse, HttpError, HttpResult, User } from '~/shared/types';
import { API_URL } from '../env';
import { gql, request } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const LOGIN_QUERY = gql`
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      accessToken: access_token 
      refreshToken: refresh_token
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
  const result = await request<LoginQueryResult>({
    url: API_URL,
    document: LOGIN_QUERY,
    variables: { auth: params },
  })
    .then(getHandleResult('login'))
    .catch(handleAuthError)
    .catch(getHandleException('Login failed'));
  return result;
}
