import { type HttpError, type HttpResult, type Project } from '~/shared';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { projectSchema } from '../schema';
import { getHandleException, handleAuthError } from '../utils';

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

export type GetProjectsResult = HttpResult<GetProjectsData, GetProjectsError>;

export const getProjects = async (): Promise<GetProjectsResult> => {
  const result = await graphQlClient
    .request<GetProjectsQueryResult>({
      document: GET_PROJECTS,
    })
    .catch(handleAuthError)
    .catch(getHandleException('Get CV failed'));

  if ('projects' in result) {
    const parsedProjects = projectSchema.array().parse(result.projects);
    return { ok: true, data: parsedProjects };
  }

  return result;
};
