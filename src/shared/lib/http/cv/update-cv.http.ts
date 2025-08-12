import type { Cv, HttpError, HttpResult, UpdateCvInput } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const UPDATE_CV = gql`
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      ${Queries.CV_QUERY}
    }
  }
`;

type UpdateCvMutationResult = { updateCv: Cv };

type UpdateCvMutationVariables = {
  cv: UpdateCvInput;
};

export type UpdateCvData = Cv;

export type UpdateCvError = HttpError;

export type UpdateCvParams = {
  cvId: string;
  cv: {
    name: string;
    description: string;
    education?: string;
  };
};

export type UpdateCvResult = HttpResult<UpdateCvData, UpdateCvError>;

export async function updateCv(params: UpdateCvParams): Promise<UpdateCvResult> {
  const result = await graphQlClient
    .request<UpdateCvMutationResult, UpdateCvMutationVariables>({
      document: UPDATE_CV,
      variables: {
        cv: { cvId: params.cvId, ...params.cv },
      },
    })
    .then(getHandleResult('updateCv'))
    .catch(handleAuthError)
    .catch(getHandleException('Updating CV failed'));
  return result;
}
