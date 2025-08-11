import type { HttpError, HttpResult, UpdateProfileInput } from '~/shared';
import { gql, graphQlClient } from '../graphql.http';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

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

type UpdateProfileVars = {
  profile: UpdateProfileInput;
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
  const { userId, firstName, lastName } = params;
  const result = await graphQlClient
    .request<UpdateProfileMutationResult, UpdateProfileVars>({
      document: UPDATE_PROFILE_MUTATION,
      variables: { profile: { userId, first_name: firstName, last_name: lastName } },
    })
    .then(getHandleResult('updateProfile'))
    .catch(handleAuthError)
    .catch(getHandleException('Profile update failed'));
  return result;
}
