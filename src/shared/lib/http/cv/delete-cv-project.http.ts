import type { Cv, DeleteCvProjectInput, HttpError, HttpResult } from '~/shared';
import { ClientError, gql, graphQlClient } from '../graphql.http';
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
};

export type DeleteCvProjectResult = HttpResult<DeleteCvProjectData, DeleteCvProjectError>;

export async function deleteCvProject(params: DeleteCvProjectParams): Promise<DeleteCvProjectResult> {
  try {
    const response = await graphQlClient.request<DeleteCvMutationResult, DeleteCvMutationVariables>({
      document: DELETE_CV_SKILL,
      variables: { project: { cvId: params.cvId, projectId: params.projectId } },
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
