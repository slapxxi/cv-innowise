import { type HttpError, type HttpResult, type User } from '~/shared';
import { ClientError, gql, request } from './graphql.http';
import { errorsSchema } from './schema';
import { Queries } from './queries';
import { API_URL } from './const';

const GET_USER_QUERY = gql`
  query User($userId: ID!) {
    user(userId: $userId) {
      ${Queries.USER_QUERY}
    }
  }
`;

type GetUserQueryResult = {
  user: User;
};

export type GetUserData = GetUserQueryResult['user'];

export type GetUserError = HttpError;

export type GetUserParams = {
  id: string;
  accessToken: string;
};

export type GetUserResult = HttpResult<GetUserData, GetUserError>;

export async function getUser(params: GetUserParams): Promise<GetUserResult> {
  try {
    const response = await request<GetUserQueryResult>({
      url: API_URL,
      document: GET_USER_QUERY,
      variables: { userId: params.id },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.user };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Get user failed' } };
  }
}
