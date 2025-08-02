import type { Cv, DeleteCvProjectInput, HttpError, HttpResult } from '~/shared';
import { API_URL } from '../const';
import { ClientError, gql, request } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';

const DELETE_CV_SKILL = gql`
  mutation DeleteCvProject($project: RemoveCvProjectInput!) {
    removeCvProject(project: $project) {
      ${Queries.CV_QUERY}
    }
  }
`;

type DeleteCvMutationResult = { deleteCvProject: Cv };

type DeleteCvMutationVariables = {
  project: DeleteCvProjectInput;
};

export type DeleteCvProjectData = Cv;

export type DeleteCvProjectError = HttpError;

export type DeleteCvProjectParams = {
  cvId: string;
  projectId: string;
  accessToken: string;
};

export type DeleteCvProjectResult = HttpResult<DeleteCvProjectData, DeleteCvProjectError>;

export async function deleteCvProject(params: DeleteCvProjectParams): Promise<DeleteCvProjectResult> {
  try {
    const response = await request<DeleteCvMutationResult, DeleteCvMutationVariables>({
      url: API_URL,
      document: DELETE_CV_SKILL,
      variables: { project: { cvId: params.cvId, projectId: params.projectId } },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.deleteCvProject };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Deleting Cv skills failed' } };
  }
}
