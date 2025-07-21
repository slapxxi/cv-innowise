import { type HttpError, type HttpResult, unAuthClient, type User } from '~/shared';
import { ClientError, gql } from './graphql.http';
import { errorsSchema } from './schema';
import { QUERIES } from './queries';

const GET_USER_QUERY = gql`
  query User($userId: ID!) {
    user(userId: $userId) {
      ${QUERIES.USER_QUERY}
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
};

export type GetUserResult = HttpResult<GetUserData, GetUserError>;

export async function getUser(params: GetUserParams): Promise<GetUserResult> {
  try {
    const response = await unAuthClient.request<GetUserQueryResult>(GET_USER_QUERY, { userId: String(params.id) });
    return { ok: true, data: response.user };
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
