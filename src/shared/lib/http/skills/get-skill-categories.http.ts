import { type HttpError, type HttpResult, type SkillCategory } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const GET_SKILL_CATEGORIES = gql`
  query Categories {
    skillCategories {
      ${Queries.SKILL_CATEGORY_QUERY}
    }
  }
`;

type GetSkillCategoriesQueryResult = {
  skillCategories: SkillCategory[];
};

export type GetSkillCategoriesData = SkillCategory[];

export type GetSkillCategoriesError = HttpError;

export type GetSkillCategoriesResult = HttpResult<GetSkillCategoriesData, GetSkillCategoriesError>;

export const getSkillCategories = async (): Promise<GetSkillCategoriesResult> => {
  const result = await graphQlClient
    .request<GetSkillCategoriesQueryResult>({
      document: GET_SKILL_CATEGORIES,
    })
    .then(getHandleResult('skillCategories'))
    .catch(handleAuthError)
    .catch(getHandleException('Get skill categories failed'));
  return result;
};
