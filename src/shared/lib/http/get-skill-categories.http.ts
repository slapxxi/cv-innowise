import { ClientError, gql, request, type HttpError, type HttpResult, type SkillCategory } from '~/shared';
import { API_URL, StatusCodes } from '~/shared/lib/http/const';
import { Queries } from './queries';

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

export type GetSkillCategoriesParams = {
  accessToken: string;
};

export type GetSkillCategoriesResult = HttpResult<GetSkillCategoriesData, GetSkillCategoriesError>;

export const getSkillCategories = async (params: GetSkillCategoriesParams): Promise<GetSkillCategoriesResult> => {
  try {
    const response = await request<GetSkillCategoriesQueryResult>({
      url: API_URL,
      document: GET_SKILL_CATEGORIES,
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
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
