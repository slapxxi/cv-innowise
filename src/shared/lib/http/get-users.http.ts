import type { User } from 'cv-graphql';
import { ClientError, gql, request, type HttpError, type HttpResult } from '~/shared';
import { API_URL, StatusCodes } from '~/shared/lib/http/const';
import { Queries } from '~/shared/lib/http/queries';

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

export type GetUsersData = {
  users: User[];
};

export type GetUsersError = HttpError;

export type GetUsersParams = {
  accessToken: string;
};

export type GetUsersResult = HttpResult<GetUsersData, GetUsersError>;

export const getUsers = async (params: GetUsersParams): Promise<GetUsersResult> => {
  try {
    const response = await request<GetUsersQueryResult>({
      url: API_URL,
      document: GET_USERS_QUERY,
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    const { users } = response;
    return { ok: true, data: { users } };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get users failed' } };
  }
};
