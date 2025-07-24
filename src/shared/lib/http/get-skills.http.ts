import { ClientError, gql, request, type HttpError, type HttpResult, type Skill } from '~/shared';
import { API_URL, StatusCodes } from '~/shared/lib/http/const';
import { Queries } from './queries';

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

export type GetSkillsParams = {
  accessToken: string;
};

export type GetSkillsResult = HttpResult<GetSkillsData, GetSkillsError>;

export const getSkills = async (params: GetSkillsParams): Promise<GetSkillsResult> => {
  try {
    const response = await request<GetSkillsQueryResult>({
      url: API_URL,
      document: GET_SKILLS,
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.skills };
  } catch (e) {
    if (e instanceof ClientError) {
      console.log(e);
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get skills failed' } };
  }
};
