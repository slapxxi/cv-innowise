import { type HttpError, type HttpResult, type User } from '~/shared';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

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
  const result = await graphQlClient
    .request<GetUsersQueryResult>({
      document: GET_USERS_QUERY,
    })
    .then(getHandleResult('users'))
    .catch(handleAuthError)
    .catch(getHandleException('Get users failed'));
  return result;
};
