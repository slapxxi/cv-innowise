import { groupBy } from 'lodash';
import * as z from 'zod/v4';
import {
  type HttpError,
  type HttpResult,
  type Mastery,
  type SkillCategory,
  type User,
  type UserWithSkillsByCategories,
} from '~/shared';
import { API_URL } from '../env';
import { ClientError, gql, request } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema, skillCategorySchema, userSchema } from '../schema';

const GET_USER_QUERY = gql`
  query User($userId: ID!) {
    user(userId: $userId) {
      ${Queries.USER_QUERY}
    }

    skillCategories {
      id
      name
    }
  }
`;

type GetUserQueryResult = {
  user: User;
  skillCategories: Pick<SkillCategory, 'id' | 'name'>[];
};

export type GetUserData = UserWithSkillsByCategories;

export type GetUserError = HttpError;

export type GetUserParams = {
  id: string;
  accessToken: string;
};

export type GetUserResult = HttpResult<GetUserData, GetUserError>;

const groupByCategoriesSchema = z
  .object({
    user: userSchema,
    skillCategories: skillCategorySchema.array(),
  })
  .transform((data) => {
    const skills = data.user.profile.skills;
    const mapped = skills.map((s) => ({
      name: s.name,
      mastery: s.mastery as Mastery,
      categoryId: s.categoryId,
      categoryName: data.skillCategories.find((c) => c.id === s.categoryId)?.name ?? 'No category',
    }));
    return groupBy(mapped, 'categoryName');
  });

export async function getUser(params: GetUserParams): Promise<GetUserResult> {
  try {
    const response = await request<GetUserQueryResult>({
      url: API_URL,
      document: GET_USER_QUERY,
      variables: { userId: params.id },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    const { data, success } = groupByCategoriesSchema.safeParse(response);
    const result = {
      ...response.user,
      skillsByCategories: success ? data : null,
    };
    return { ok: true, data: result };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Get user failed' } };
  }
}
