import type { Cv, HttpError, HttpResult, UpdateCvProjectInput } from '~/shared';
import { API_URL } from '../env';
import { ClientError, gql, request } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';

const DELETE_CV_SKILL = gql`
  mutation UpdateCvProject($project: UpdateCvProjectInput!) {
    updateCvProject(project: $project) {
      ${Queries.CV_QUERY}
    }
  }
`;

type UpdateCvMutationResult = { updateCvProject: Cv };

type UpdateCvMutationVariables = {
  project: UpdateCvProjectInput;
};

export type UpdateCvProjectData = Cv;

export type UpdateCvProjectError = HttpError;

export type UpdateCvProjectParams = {
  cvId: string;
  projectId: string;
  roles: string[];
  responsibilities: string[];
  startDate: string;
  endDate?: string;
  accessToken: string;
};

export type UpdateCvProjectResult = HttpResult<UpdateCvProjectData, UpdateCvProjectError>;

export async function updateCvProject(params: UpdateCvProjectParams): Promise<UpdateCvProjectResult> {
  try {
    console.log(params);
    const response = await request<UpdateCvMutationResult, UpdateCvMutationVariables>({
      url: API_URL,
      document: DELETE_CV_SKILL,
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
    return { ok: true, data: response.updateCvProject };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Updating cv project failed' } };
  }
}
