import { type HttpError, type HttpResult, type Skill } from '~/shared';
import { StatusCodes } from '../const';
import { ClientError, gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';

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
  try {
    const response = await graphQlClient.request<GetSkillsQueryResult>({
      document: GET_SKILLS,
    });
    return { ok: true, data: response.skills };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get skills failed' } };
  }
};
