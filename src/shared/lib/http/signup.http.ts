import type { AuthResult, HttpError, HttpResult } from '~/shared';
import { ClientError, gql, graphQLClient } from './graphql.http';
import { errorsSchema } from './schema';
import { QUERIES } from './queries';

const SIGNUP_QUERY = gql`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      access_token
      refresh_token
      ${QUERIES.USER_QUERY}
    }
  }
`;

type SignupQueryResult = { signup: AuthResult };

export type SignupData = SignupQueryResult['signup'];

export type SignupError = HttpError;

export type SignupParams = {
  email: string;
  password: string;
};

export type SignupResult = HttpResult<SignupData, SignupError>;

export async function signup(params: SignupParams): Promise<SignupResult> {
  try {
    const response = await graphQLClient.request<SignupQueryResult>(SIGNUP_QUERY, { auth: params });
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
