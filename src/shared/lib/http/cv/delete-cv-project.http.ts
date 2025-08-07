import type { Cv, DeleteCvProjectInput, HttpError, HttpResult } from '~/shared';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

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
  const result = await graphQlClient
    .request<DeleteCvMutationResult, DeleteCvMutationVariables>({
      document: DELETE_CV_SKILL,
      variables: { project: { cvId: params.cvId, projectId: params.projectId } },
    })
    .then(getHandleResult('deleteCvProject'))
    .catch(handleAuthError)
    .catch(getHandleException('Delete CV project failed'));
  return result;
}
