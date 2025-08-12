import type { Cv, HttpError, HttpResult, Mastery } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

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
  const result = await graphQlClient
    .request<CreateCvMutationResult, CreateCvMutationVariables>({
      document: CREATE_Cv_SKILL,
      variables: { skill: { cvId: params.cvId, ...params.skill } },
    })
    .then(getHandleResult('addCvSkill'))
    .catch(handleAuthError)
    .catch(getHandleException('Create CV skill failed'));
  return result;
}
