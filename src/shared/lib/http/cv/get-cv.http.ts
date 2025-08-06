import { groupBy } from 'lodash';
import z from 'zod/v4';
import { type Cv, type CvWithSkillsByCategories, type HttpError, type HttpResult, type Mastery } from '~/shared';
import { StatusCodes } from '../const';
import { ClientError, gql, graphQlClient } from '../graphql.http';
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
    const response = await graphQlClient.request<GetCvQueryResult, GetCvQueryVariables>({
      document: GET_CV,
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
