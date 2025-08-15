import type { Cv, HttpError, HttpResult, UpdateCvProjectInput } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

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
};

export type UpdateCvProjectResult = HttpResult<UpdateCvProjectData, UpdateCvProjectError>;

export async function updateCvProject(params: UpdateCvProjectParams): Promise<UpdateCvProjectResult> {
  const result = await graphQlClient
    .request<UpdateCvMutationResult, UpdateCvMutationVariables>({
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
    })
    .then(getHandleResult('updateCvProject'))
    .catch(handleAuthError)
    .catch(getHandleException('Update CV project failed'));
  return result;
}
