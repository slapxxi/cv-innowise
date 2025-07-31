import { groupBy } from 'lodash';
import z from 'zod/v4';
import {
  ClientError,
  gql,
  request,
  type Cv,
  type CvWithSkillsByCategories,
  type HttpError,
  type HttpResult,
  type Mastery,
} from '~/shared';
import { StatusCodes } from '../const';
import { API_URL } from '../env';
import { Queries } from '../queries';
import { cvSchema, skillCategorySchema } from '../schema';

const GET_CV = gql`
  query Cv($cvId: ID!) {
    cv(cvId: $cvId) {
      ${Queries.CV_QUERY}
    }

    skillCategories {
      id
      name
    }
  }
`;

type GetCvQueryResult = { cv: Cv };

type GetCvQueryVariables = {
  cvId: string;
};

export type GetCvData = CvWithSkillsByCategories;

export type GetCvError = HttpError;

export type GetCvParams = {
  id: string;
  accessToken: string;
};

export type GetCvResult = HttpResult<GetCvData, GetCvError>;

const groupByCategoriesSchema = z
  .object({
    cv: cvSchema,
    skillCategories: skillCategorySchema.array(),
  })
  .transform((data) => {
    const skills = data.cv.skills;
    const mapped = skills?.map((s) => ({
      name: s.name,
      mastery: s.mastery as Mastery,
      categoryId: s.categoryId,
      categoryName: data.skillCategories.find((c) => c.id === s.categoryId)?.name ?? 'No category',
    }));
    return groupBy(mapped ?? [], 'categoryName');
  });

export const getCv = async (params: GetCvParams): Promise<GetCvResult> => {
  try {
    const response = await request<GetCvQueryResult, GetCvQueryVariables>({
      url: API_URL,
      document: GET_CV,
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
      variables: { cvId: params.id },
    });
    const { data, success } = groupByCategoriesSchema.safeParse(response);
    const result = {
      ...response.cv,
      skillsByCategories: success ? data : null,
    };
    return { ok: true, data: result };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get CV failed' } };
  }
};
