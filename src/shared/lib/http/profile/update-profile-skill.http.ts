import type { HttpError, HttpResult, Mastery, Profile } from '~/shared';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const UPDATE_PROFILE_SKILL = gql`
  mutation UpdateProfileSkill($skill: UpdateProfileSkillInput!) {
    updateProfileSkill(skill: $skill) {
      ${Queries.PROFILE_QUERY}
    }
  }
`;

type UpdateProfileMutationResult = { updateProfileSkill: Profile };

export type UpdateProfileSkillData = Profile;

export type UpdateProfileSkillError = HttpError;

export type UpdateProfileSkillParams = {
  userId: string;
  skill: {
    name: string;
    mastery: Mastery;
    categoryId?: string | null;
  };
};

export type UpdateProfileSkillResult = HttpResult<UpdateProfileSkillData, UpdateProfileSkillError>;

export async function updateProfileSkill(params: UpdateProfileSkillParams): Promise<UpdateProfileSkillResult> {
  const result = await graphQlClient
    .request<UpdateProfileMutationResult>({
      document: UPDATE_PROFILE_SKILL,
      variables: { skill: { userId: params.userId, ...params.skill } },
    })
    .then(getHandleResult('updateProfileSkill'))
    .catch(handleAuthError)
    .catch(getHandleException(`Updating profile skill "${params.skill.name}" failed`));
  return result;
}
