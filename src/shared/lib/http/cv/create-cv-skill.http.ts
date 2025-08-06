import type { Cv, HttpError, HttpResult, Mastery } from '~/shared';
import { ClientError, gql, graphQlClient } from '../graphql.http';
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
};

export type CreateCvSkillResult = HttpResult<CreateCvSkillData, CreateCvSkillError>;

export async function createCvSkill(params: CreateCvSkillParams): Promise<CreateCvSkillResult> {
  try {
    const response = await graphQlClient.request<CreateCvMutationResult, CreateCvMutationVariables>({
      document: CREATE_Cv_SKILL,
      variables: { skill: { cvId: params.cvId, ...params.skill } },
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
