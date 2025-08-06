import { type HttpError, type HttpResult, type User } from '~/shared';
import { StatusCodes } from '../const';
import { ClientError, gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';

const GET_USERS_QUERY = gql`
  query Users {
    users {
      ${Queries.USER_QUERY}
    }
  }
`;

type GetUsersQueryResult = {
  users: User[];
};

export type GetUsersData = User[];

export type GetUsersError = HttpError;

export type GetUsersResult = HttpResult<GetUsersData, GetUsersError>;

export const getUsers = async (): Promise<GetUsersResult> => {
  try {
    const response = await graphQlClient.request<GetUsersQueryResult>({
      document: GET_USERS_QUERY,
    });
    const { users } = response;
    return { ok: true, data: users };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get users failed' } };
  }
};
