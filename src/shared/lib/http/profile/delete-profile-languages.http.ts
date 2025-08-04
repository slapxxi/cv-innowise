import type { HttpError, HttpResult, Profile } from '~/shared';
import { ClientError, gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';

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
  try {
    const response = await graphQlClient.request<DeleteProfileMutationResult, QueryVariables>({
      document: DELETE_PROFILE_LANGS,
      variables: { language: { userId: params.userId, name: params.languageNames } },
    });
    return { ok: true, data: response.deleteProfileLanguage };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Deleting profile languages failed' } };
  }
}
