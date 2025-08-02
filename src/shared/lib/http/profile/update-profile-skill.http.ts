import type { HttpError, HttpResult, Mastery, Profile } from '~/shared';
import { API_URL } from '../env';
import { ClientError, gql, request } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';

const UPDATE_PROFILE_SKILL = gql`
  mutation UpdateProfileSkill($skill: UpdateProfileSkillInput!) {
    updateProfileSkill(skill: $skill) {
      ${Queries.PROFILE_QUERY}
    }
  }
`;

type UpdateProfileMutationResult = { updateProfileSkill: Profile };

export type UpdateProfileSkillData = Profile;

export type UpdateProfileSkillError = HttpError;

export type UpdateProfileSkillParams = {
  userId: string;
  skill: {
    name: string;
    mastery: Mastery;
    categoryId?: string | null;
  };
  accessToken: string;
};

export type UpdateProfileSkillResult = HttpResult<UpdateProfileSkillData, UpdateProfileSkillError>;

export async function updateProfileSkill(params: UpdateProfileSkillParams): Promise<UpdateProfileSkillResult> {
  try {
    const response = await request<UpdateProfileMutationResult>({
      url: API_URL,
      document: UPDATE_PROFILE_SKILL,
      variables: { skill: { userId: params.userId, ...params.skill } },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.updateProfileSkill };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: `Updating profile skill "${params.skill.name}" failed` } };
  }
}
