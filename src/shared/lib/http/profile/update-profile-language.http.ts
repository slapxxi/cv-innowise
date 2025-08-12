import type { HttpError, HttpResult, Proficiency, Profile } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const UPDATE_PROFILE_LANGUAGE = gql`
  mutation UpdateProfileLanguage($language: UpdateProfileLanguageInput!) {
    updateProfileLanguage(language: $language) {
      ${Queries.PROFILE_QUERY}
    }
  }
`;

type UpdateProfileMutationResult = { updateProfileLanguage: Profile };

export type UpdateProfileLanguageData = Profile;

export type UpdateProfileLanguageError = HttpError;

export type UpdateProfileLanguageParams = {
  userId: string;
  language: {
    name: string;
    proficiency: Proficiency;
  };
};

export type UpdateProfileLanguageResult = HttpResult<UpdateProfileLanguageData, UpdateProfileLanguageError>;

export async function updateProfileLanguage(params: UpdateProfileLanguageParams): Promise<UpdateProfileLanguageResult> {
  const result = await graphQlClient
    .request<UpdateProfileMutationResult>({
      document: UPDATE_PROFILE_LANGUAGE,
      variables: {
        language: { userId: params.userId, ...params.language },
      },
    })
    .then(getHandleResult('updateProfileLanguage'))
    .catch(handleAuthError)
    .catch(getHandleException('Update profile language failed'));
  return result;
}
