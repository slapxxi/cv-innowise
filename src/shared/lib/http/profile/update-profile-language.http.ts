import type { HttpError, HttpResult, Proficiency, Profile } from '~/shared';
import { API_URL } from '../const';
import { ClientError, gql, request } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';

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
  accessToken: string;
};

export type UpdateProfileLanguageResult = HttpResult<UpdateProfileLanguageData, UpdateProfileLanguageError>;

export async function updateProfileLanguage(params: UpdateProfileLanguageParams): Promise<UpdateProfileLanguageResult> {
  try {
    const response = await request<UpdateProfileMutationResult>({
      url: API_URL,
      document: UPDATE_PROFILE_LANGUAGE,
      variables: {
        language: { userId: params.userId, ...params.language },
      },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.updateProfileLanguage };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Updating profile language failed' } };
  }
}
