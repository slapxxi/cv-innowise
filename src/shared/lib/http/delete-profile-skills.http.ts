import type { HttpError, HttpResult, Profile } from '~/shared';
import { API_URL } from './const';
import { ClientError, gql, request } from './graphql.http';
import { Queries } from './queries';
import { errorsSchema } from './schema';

const DELETE_PROFILE_SKILL = gql`
  mutation DeleteProfileSkill($skill: DeleteProfileSkillInput!) {
    deleteProfileSkill(skill: $skill) {
      ${Queries.PROFILE_QUERY}
    }
  }
`;

type DeleteProfileMutationResult = { deleteProfileSkill: Profile };

export type DeleteProfileSkillsData = Profile;

export type DeleteProfileSkillsError = HttpError;

export type DeleteProfileSkillsParams = {
  userId: string;
  skillNames: string[];
  accessToken: string;
};

export type DeleteProfileSkillResult = HttpResult<DeleteProfileSkillsData, DeleteProfileSkillsError>;

export async function deleteProfileSkills(params: DeleteProfileSkillsParams): Promise<DeleteProfileSkillResult> {
  try {
    const response = await request<DeleteProfileMutationResult>({
      url: API_URL,
      document: DELETE_PROFILE_SKILL,
      variables: { skill: { userId: params.userId, name: params.skillNames } },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.deleteProfileSkill };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Deleting profile skills failed' } };
  }
}
