import type { HttpError, HttpResult, Mastery, Profile } from '~/shared';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

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
};

export type CreateProfileSkillResult = HttpResult<CreateProfileSkillData, CreateProfileSkillError>;

export async function createProfileSkill(params: CreateProfileSkillParams): Promise<CreateProfileSkillResult> {
  const result = await graphQlClient
    .request<CreateProfileMutationResult>({
      document: CREATE_PROFILE_SKILL,
      variables: { skill: params.skill },
    })
    .then(getHandleResult('addProfileSkill'))
    .catch(handleAuthError)
    .catch(getHandleException('Add profile skill failed'));
  return result;
}
