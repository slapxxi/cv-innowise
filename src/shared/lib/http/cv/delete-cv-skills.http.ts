import type { Cv, HttpError, HttpResult } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

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
  const result = await graphQlClient
    .request<DeleteCvMutationResult, DeleteCvMutationVariables>({
      document: DELETE_CV_SKILL,
      variables: { skill: { cvId: params.cvId, name: params.skillNames } },
    })
    .then(getHandleResult('deleteCvSkill'))
    .catch(handleAuthError)
    .catch(getHandleException('Delete CV skill failed'));
  return result;
}
