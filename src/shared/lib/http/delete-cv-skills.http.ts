import type { HttpError, HttpResult, Cv } from '~/shared';
import { API_URL } from './const';
import { ClientError, gql, request } from './graphql.http';
import { Queries } from './queries';
import { cvSchema, errorsSchema } from './schema';

const DELETE_CV_SKILL = gql`
  mutation DeleteCvSkill($skill: DeleteCvSkillInput!) {
    deleteCvSkill(skill: $skill) {
      ${Queries.CV_QUERY}
    }
  }
`;

type DeleteCvMutationResult = { deleteCvSkill: Cv };

type DeleteCvMutationVariables = {
  skill: {
    cvId: string;
    name: string[];
  };
};

export type DeleteCvSkillsData = Cv;

export type DeleteCvSkillsError = HttpError;

export type DeleteCvSkillsParams = {
  cvId: string;
  skillNames: string[];
  accessToken: string;
};

export type DeleteCvSkillResult = HttpResult<DeleteCvSkillsData, DeleteCvSkillsError>;

export async function deleteCvSkills(params: DeleteCvSkillsParams): Promise<DeleteCvSkillResult> {
  try {
    const response = await request<DeleteCvMutationResult, DeleteCvMutationVariables>({
      url: API_URL,
      document: DELETE_CV_SKILL,
      variables: { skill: { cvId: params.cvId, name: params.skillNames } },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    const parsedCv = cvSchema.parse(response.deleteCvSkill);
    return { ok: true, data: parsedCv };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Deleting Cv skills failed' } };
  }
}
