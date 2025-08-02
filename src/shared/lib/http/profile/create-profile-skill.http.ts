import type { HttpError, HttpResult, Mastery, Profile } from '~/shared';
import { API_URL } from '../env';
import { ClientError, gql, request } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';

const CREATE_PROFILE_SKILL = gql`
  mutation AddProfileSkill($skill: AddProfileSkillInput!) {
    addProfileSkill(skill: $skill) {
      ${Queries.PROFILE_QUERY}
    }
  }
`;

type CreateProfileMutationResult = { addProfileSkill: Profile };

export type CreateProfileSkillData = Profile;

export type CreateProfileSkillError = HttpError;

export type CreateProfileSkillParams = {
  skill: {
    userId: string;
    name: string;
    mastery: Mastery;
    categoryId?: string;
  };
  accessToken: string;
};

export type CreateProfileSkillResult = HttpResult<CreateProfileSkillData, CreateProfileSkillError>;

export async function createProfileSkill(params: CreateProfileSkillParams): Promise<CreateProfileSkillResult> {
  try {
    const response = await request<CreateProfileMutationResult>({
      url: API_URL,
      document: CREATE_PROFILE_SKILL,
      variables: { skill: params.skill },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.addProfileSkill };
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
