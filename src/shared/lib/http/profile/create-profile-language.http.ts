import type { HttpError, HttpResult, Proficiency, Profile } from '~/shared';
import { ClientError, gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';

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
  try {
    const response = await graphQlClient.request<CreateProfileMutationResult>({
      document: CREATE_PROFILE_LANGUAGE,
      variables: {
        language: { userId: params.userId, ...params.language },
      },
    });
    return { ok: true, data: response.addProfileLanguage };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Signup failed' } };
  }
}
