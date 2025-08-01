import type { HttpError, HttpResult, Mastery, Cv } from '~/shared';
import { API_URL } from '../const';
import { ClientError, gql, request } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';

const CREATE_Cv_SKILL = gql`
  mutation AddCvSkill($skill: AddCvSkillInput!) {
    addCvSkill(skill: $skill) {
      ${Queries.CV_QUERY}
    }
  }
`;

type CreateCvMutationResult = { addCvSkill: Cv };

type CreateCvMutationVariables = { skill: { cvId: string; name: string; categoryId?: string; mastery: Mastery } };

export type CreateCvSkillData = Cv;

export type CreateCvSkillError = HttpError;

export type CreateCvSkillParams = {
  cvId: string;
  skill: {
    name: string;
    mastery: Mastery;
    categoryId?: string;
  };
  accessToken: string;
};

export type CreateCvSkillResult = HttpResult<CreateCvSkillData, CreateCvSkillError>;

export async function createCvSkill(params: CreateCvSkillParams): Promise<CreateCvSkillResult> {
  try {
    const response = await request<CreateCvMutationResult, CreateCvMutationVariables>({
      url: API_URL,
      document: CREATE_Cv_SKILL,
      variables: { skill: { cvId: params.cvId, ...params.skill } },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.addCvSkill };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Create cv skill failed' } };
  }
}
