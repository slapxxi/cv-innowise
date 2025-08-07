import type { HttpError, HttpResult, Proficiency, Profile } from '~/shared';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const CREATE_PROFILE_LANGUAGE = gql`
  mutation AddProfileLanguage($language: AddProfileLanguageInput!) {
    addProfileLanguage(language: $language) {
      ${Queries.PROFILE_QUERY}
    }
  }
`;

type CreateProfileMutationResult = { addProfileLanguage: Profile };

export type CreateProfileLanguageData = Profile;

export type CreateProfileLanguageError = HttpError;

export type CreateProfileLanguageParams = {
  userId: string;
  language: {
    name: string;
    proficiency: Proficiency;
  };
};

export type CreateProfileLanguageResult = HttpResult<CreateProfileLanguageData, CreateProfileLanguageError>;

export async function createProfileLanguage(params: CreateProfileLanguageParams): Promise<CreateProfileLanguageResult> {
  const result = await graphQlClient
    .request<CreateProfileMutationResult>({
      document: CREATE_PROFILE_LANGUAGE,
      variables: {
        language: { userId: params.userId, ...params.language },
      },
    })
    .then(getHandleResult('addProfileLanguage'))
    .catch(handleAuthError)
    .catch(getHandleException('Add profile language failed'));
  return result;
}
