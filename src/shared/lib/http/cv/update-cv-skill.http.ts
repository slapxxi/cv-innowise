import type { Cv, HttpError, HttpResult, Mastery } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

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
};

export type UpdateCvSkillResult = HttpResult<UpdateCvSkillData, UpdateCvSkillError>;

export async function updateCvSkill(params: UpdateCvSkillParams): Promise<UpdateCvSkillResult> {
  const result = await graphQlClient
    .request<UpdateCvMutationResult, UpdateCvMutationVariables>({
      document: UPDATE_CV_SKILL,
      variables: { skill: { cvId: params.cvId, ...params.skill } },
    })
    .then(getHandleResult('updateCvSkill'))
    .catch(handleAuthError)
    .catch(getHandleException(`Update CV skill ${params.skill.name} failed`));
  return result;
}
