import { type HttpError, type HttpResult, type Skill } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const GET_SKILLS = gql`
  query Skills {
    skills {
      ${Queries.SKILL_QUERY}
    }
  }
`;

type GetSkillsQueryResult = {
  skills: Skill[];
};

export type GetSkillsData = Skill[];

export type GetSkillsError = HttpError;

export type GetSkillsResult = HttpResult<GetSkillsData, GetSkillsError>;

export const getSkills = async (): Promise<GetSkillsResult> => {
  const result = await graphQlClient
    .request<GetSkillsQueryResult>({
      document: GET_SKILLS,
    })
    .then(getHandleResult('skills'))
    .catch(handleAuthError)
    .catch(getHandleException('Get skills failed'));
  return result;
};
