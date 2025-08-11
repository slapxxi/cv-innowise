import type { AddCvProjectInput } from 'cv-graphql';
import type { Cv, HttpError, HttpResult } from '~/shared';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

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
  startDate: string;
  endDate?: string;
};

export type AddCvProjectResult = HttpResult<AddCvProjectData, AddCvProjectError>;

export async function addCvProject(params: AddCvProjectParams): Promise<AddCvProjectResult> {
  const result = await graphQlClient
    .request<AddCvMutationResult, AddCvMutationVariables>({
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
    })
    .then(getHandleResult('addCvProject'))
    .catch(handleAuthError)
    .catch(getHandleException('Add CV project failed'));
  return result;
}
