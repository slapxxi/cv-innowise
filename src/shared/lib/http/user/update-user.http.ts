import type { HttpError, HttpResult } from '~/shared';
import { ClientError, gql, graphQlClient } from '../graphql.http';
import { errorsSchema } from '../schema';

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
  try {
    const { ...userData } = params;
    const response = await graphQlClient.request<UpdateUserMutationResult>({
      document: UPDATE_USER_MUTATION,
      variables: { user: userData },
    });

    return { ok: true, data: response.updateUser };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'User update failed' } };
  }
}
