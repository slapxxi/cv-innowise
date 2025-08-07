import type { AuthResponse, HttpError, HttpResult, User } from '~/shared';
import { API_URL } from '../env';
import { gql, request } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const SIGNUP_QUERY = gql`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      accessToken: access_token
      refreshToken: refresh_token
      user {
        ${Queries.USER_QUERY}
      }
    }
  }
`;

type SignupQueryResult = { signup: AuthResponse };

export type SignupData = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type SignupError = HttpError;

export type SignupParams = {
  email: string;
  password: string;
};

export type SignupResult = HttpResult<SignupData, SignupError>;

export async function signup(params: SignupParams): Promise<SignupResult> {
  const result = await request<SignupQueryResult>({
    url: API_URL,
    document: SIGNUP_QUERY,
    variables: { auth: params },
  })
    .then(getHandleResult('signup'))
    .catch(handleAuthError)
    .catch(getHandleException('Signup failed'));
  return result;
}
