import { type HttpError, type HttpResult, type SkillCategory } from '~/shared';
import { StatusCodes } from '../const';
import { ClientError, gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';

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
  try {
    const response = await graphQlClient.request<GetSkillCategoriesQueryResult>({
      document: GET_SKILL_CATEGORIES,
    });
    return { ok: true, data: response.skillCategories };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get skill categories failed' } };
  }
};
