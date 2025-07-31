import type { AuthResponse, HttpError, HttpResult, User } from '~/shared';
import { ClientError, gql, request } from '~/shared';
import { Queries } from '~/shared/lib/http/queries';
import { API_URL } from '../env';
import { errorsSchema } from '../schema';

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
  try {
    const response = await request<SignupQueryResult>({
      url: API_URL,
      document: SIGNUP_QUERY,
      variables: { auth: params },
    });
    const { accessToken, refreshToken, user } = response.signup;
    return { ok: true, data: { accessToken, refreshToken, user } };
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
