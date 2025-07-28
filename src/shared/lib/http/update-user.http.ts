import type { HttpError, HttpResult } from '~/shared';
import { ClientError, gql, request } from './graphql.http';
import { errorsSchema } from './schema';
import { API_URL } from './const';

export type UpdateUserParams = {
  userId: string;
  positionId?: string;
  departmentId?: string;
  role?: string;
  accessToken?: string;
};

export type UpdateUserData = {
  id: string;
  role: string;
  department_name: string;
  position_name: string;
};

export type UpdateUserError = HttpError;

export type UpdateUserResult = HttpResult<UpdateUserData, UpdateUserError>;

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

type UpdateUserMutationResult = {
  updateUser: UpdateUserData;
};

export async function updateUser(params: UpdateUserParams): Promise<UpdateUserResult> {
  try {
    const { accessToken, ...userData } = params;
    const response = await request<UpdateUserMutationResult>({
      url: API_URL,
      document: UPDATE_USER_MUTATION,
      variables: { user: userData },
      requestHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
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
