import type { Cv, HttpError, HttpResult } from '~/shared';
import { API_URL } from '../const';
import { ClientError, gql, request } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';
import type { AddCvProjectInput } from 'cv-graphql';

const ADD_CV_PROJECT = gql`
  mutation AddCvProject($project: AddCvProjectInput!) {
    addCvProject(project: $project) {
      ${Queries.CV_QUERY}
    }
  }
`;

type AddCvMutationResult = { addCvProject: Cv };

type AddCvMutationVariables = { project: AddCvProjectInput };

export type AddCvProjectData = Cv;

export type AddCvProjectError = HttpError;

export type AddCvProjectParams = {
  cvId: string;
  projectId: string;
  roles: string[];
  responsibilities: string[];
  accessToken: string;
  startDate: string;
  endDate?: string;
};

export type AddCvProjectResult = HttpResult<AddCvProjectData, AddCvProjectError>;

export async function addCvProject(params: AddCvProjectParams): Promise<AddCvProjectResult> {
  try {
    const response = await request<AddCvMutationResult, AddCvMutationVariables>({
      url: API_URL,
      document: ADD_CV_PROJECT,
      variables: {
        project: {
          cvId: params.cvId,
          projectId: params.projectId,
          roles: params.roles,
          responsibilities: params.responsibilities,
          start_date: params.startDate,
          end_date: params.endDate,
        },
      },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.addCvProject };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Add cv project failed' } };
  }
}
