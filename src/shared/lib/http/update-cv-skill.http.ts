import type { HttpError, HttpResult, Mastery, Cv } from '~/shared';
import { API_URL } from './const';
import { ClientError, gql, request } from './graphql.http';
import { Queries } from './queries';
import { cvSchema, errorsSchema } from './schema';

const UPDATE_CV_SKILL = gql`
  mutation UpdateCvSkill($skill: UpdateCvSkillInput!) {
    updateCvSkill(skill: $skill) {
      ${Queries.CV_QUERY}
    }
  }
`;

type UpdateCvMutationResult = { updateCvSkill: Cv };

type UpdateCvMutationVariables = {
  skill: { cvId: string; name: string; mastery: Mastery; categoryId?: string | null };
};

export type UpdateCvSkillData = Cv;

export type UpdateCvSkillError = HttpError;

export type UpdateCvSkillParams = {
  cvId: string;
  skill: {
    name: string;
    mastery: Mastery;
    categoryId?: string | null;
  };
  accessToken: string;
};

export type UpdateCvSkillResult = HttpResult<UpdateCvSkillData, UpdateCvSkillError>;

export async function updateCvSkill(params: UpdateCvSkillParams): Promise<UpdateCvSkillResult> {
  try {
    const response = await request<UpdateCvMutationResult, UpdateCvMutationVariables>({
      url: API_URL,
      document: UPDATE_CV_SKILL,
      variables: { skill: { cvId: params.cvId, ...params.skill } },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    const parsedCv = cvSchema.parse(response.updateCvSkill);
    return { ok: true, data: parsedCv };
  } catch (e) {
    console.log(e);
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: `Updating Cv skill "${params.skill.name}" failed` } };
  }
}
