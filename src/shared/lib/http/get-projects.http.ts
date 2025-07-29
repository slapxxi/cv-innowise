import { ClientError, gql, request, type HttpError, type HttpResult, type Project } from '~/shared';
import { API_URL, StatusCodes } from './const';
import { Queries } from './queries';
import { projectSchema } from './schema';

const GET_PROJECTS = gql`
  query Projects {
    projects {
      ${Queries.PROJECT_QUERY}
    }
  }
`;

type GetProjectsQueryResult = {
  projects: Project[];
};

export type GetProjectsData = Project[];

export type GetProjectsError = HttpError;

export type GetProjectsParams = {
  accessToken: string;
};

export type GetProjectsResult = HttpResult<GetProjectsData, GetProjectsError>;

export const getProjects = async (params: GetProjectsParams): Promise<GetProjectsResult> => {
  try {
    const response = await request<GetProjectsQueryResult>({
      url: API_URL,
      document: GET_PROJECTS,
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    const parsedProjects = projectSchema.array().parse(response.projects);
    return { ok: true, data: parsedProjects };
  } catch (e) {
    console.log(e);
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get Projects failed' } };
  }
};
