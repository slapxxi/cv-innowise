import type { Cv, HttpError, HttpResult } from '~/shared';
import { ClientError, gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';

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
};

export type DeleteCvSkillResult = HttpResult<DeleteCvSkillsData, DeleteCvSkillsError>;

export async function deleteCvSkills(params: DeleteCvSkillsParams): Promise<DeleteCvSkillResult> {
  try {
    const response = await graphQlClient.request<DeleteCvMutationResult, DeleteCvMutationVariables>({
      document: DELETE_CV_SKILL,
      variables: { skill: { cvId: params.cvId, name: params.skillNames } },
    });
    return { ok: true, data: response.deleteCvSkill };
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
