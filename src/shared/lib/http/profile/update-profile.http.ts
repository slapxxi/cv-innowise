import type { HttpError, HttpResult } from '~/shared';
import { ClientError, gql, graphQlClient } from '../graphql.http';
import { errorsSchema } from '../schema';

export type UpdateProfileParams = {
  userId: string;
  firstName?: string;
  lastName?: string;
};

export type UpdateProfileData = {
  id: string;
  first_name: string;
  last_name: string;
};

export type UpdateProfileError = HttpError;

export type UpdateProfileResult = HttpResult<UpdateProfileData, UpdateProfileError>;

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($profile: UpdateProfileInput!) {
    updateProfile(profile: $profile) {
      id
      first_name
      last_name
    }
  }
`;

type UpdateProfileMutationResult = {
  updateProfile: UpdateProfileData;
};

export async function updateProfile(params: UpdateProfileParams): Promise<UpdateProfileResult> {
  try {
    const { userId, firstName, lastName } = params;
    const response = await graphQlClient.request<UpdateProfileMutationResult>({
      document: UPDATE_PROFILE_MUTATION,
      variables: { profile: { userId, first_name: firstName, last_name: lastName } },
    });

    return { ok: true, data: response.updateProfile };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Profile update failed' } };
  }
}
