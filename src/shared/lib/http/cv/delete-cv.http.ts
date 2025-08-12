import type { HttpError, HttpResult } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const DELETE_gc_SKILL = gql`
  mutation DeleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`;

type DeleteCvsMutationResult = { deleteCv: { affected: number } };

type DeleteCvsMutationVariables = { cv: { cvId: string } };

export type DeleteCvData = { affected: number };

export type DeleteCvError = HttpError;

export type DeleteCvParams = {
  cvId: string;
};

export type DeleteCvResult = HttpResult<DeleteCvData, DeleteCvError>;

export async function deleteCv(params: DeleteCvParams): Promise<DeleteCvResult> {
  const response = await graphQlClient
    .request<DeleteCvsMutationResult, DeleteCvsMutationVariables>({
      document: DELETE_gc_SKILL,
      variables: { cv: { cvId: params.cvId } },
    })
    .then(getHandleResult('deleteCv'))
    .catch(handleAuthError)
    .catch(getHandleException('Deleting CV failed'));
  return response;
}
