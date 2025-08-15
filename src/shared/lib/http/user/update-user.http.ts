import type { HttpError, HttpResult } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(user: $user) {
      id
      role
      department_name
      position_name
    }
  }
`;

export type UpdateUserParams = {
  userId: string;
  positionId?: string;
  departmentId?: string;
  role?: string;
};

export type UpdateUserData = {
  id: string;
  role: string;
  department_name: string;
  position_name: string;
};

export type UpdateUserError = HttpError;

export type UpdateUserResult = HttpResult<UpdateUserData, UpdateUserError>;

type UpdateUserMutationResult = {
  updateUser: UpdateUserData;
};

export async function updateUser(params: UpdateUserParams): Promise<UpdateUserResult> {
  const { ...userData } = params;
  const result = await graphQlClient
    .request<UpdateUserMutationResult>({
      document: UPDATE_USER_MUTATION,
      variables: { user: userData },
    })
    .then(getHandleResult('updateUser'))
    .catch(handleAuthError)
    .catch(getHandleException('User update failed'));
  return result;
}
