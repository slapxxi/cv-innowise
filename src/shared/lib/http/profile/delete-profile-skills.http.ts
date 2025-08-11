import type { HttpError, HttpResult, Profile } from '~/shared';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const DELETE_PROFILE_SKILL = gql`
  mutation DeleteProfileSkill($skill: DeleteProfileSkillInput!) {
    deleteProfileSkill(skill: $skill) {
      ${Queries.PROFILE_QUERY}
    }
  }
`;

type DeleteProfileMutationResult = { deleteProfileSkill: Profile };

export type DeleteProfileSkillsData = Profile;

export type DeleteProfileSkillsError = HttpError;

export type DeleteProfileSkillsParams = {
  userId: string;
  skillNames: string[];
};

export type DeleteProfileSkillResult = HttpResult<DeleteProfileSkillsData, DeleteProfileSkillsError>;

export async function deleteProfileSkills(params: DeleteProfileSkillsParams): Promise<DeleteProfileSkillResult> {
  const result = await graphQlClient
    .request<DeleteProfileMutationResult>({
      document: DELETE_PROFILE_SKILL,
      variables: { skill: { userId: params.userId, name: params.skillNames } },
    })
    .then(getHandleResult('deleteProfileSkill'))
    .catch(handleAuthError)
    .catch(getHandleException('Delete profile skills failed'));
  return result;
}
