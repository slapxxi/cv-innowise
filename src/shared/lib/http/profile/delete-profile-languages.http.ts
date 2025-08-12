import type { HttpError, HttpResult, Profile } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const DELETE_PROFILE_LANGS = gql`
  mutation DeleteProfileLanguage($language: DeleteProfileLanguageInput!) {
    deleteProfileLanguage(language: $language) {
      ${Queries.PROFILE_QUERY}
    }
  }
`;

type QueryVariables = {
  language: {
    userId: string;
    name: string[];
  };
};

type DeleteProfileMutationResult = { deleteProfileLanguage: Profile };

export type DeleteProfileLanguagesData = Profile;

export type DeleteProfileLanguagesError = HttpError;

export type DeleteProfileLanguagesParams = {
  userId: string;
  languageNames: string[];
};

export type DeleteProfileLanguagesResult = HttpResult<DeleteProfileLanguagesData, DeleteProfileLanguagesError>;

export async function deleteProfileLanguages(
  params: DeleteProfileLanguagesParams
): Promise<DeleteProfileLanguagesResult> {
  const response = await graphQlClient
    .request<DeleteProfileMutationResult, QueryVariables>({
      document: DELETE_PROFILE_LANGS,
      variables: { language: { userId: params.userId, name: params.languageNames } },
    })
    .then(getHandleResult('deleteProfileLanguage'))
    .catch(handleAuthError)
    .catch(getHandleException('Delete profile languages failed'));
  return response;
}
