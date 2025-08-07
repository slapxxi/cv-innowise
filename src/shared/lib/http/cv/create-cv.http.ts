import type { Cv, HttpError, HttpResult } from '~/shared';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const CREATE_CV = gql`
  mutation AddCv($cv: CreateCvInput!) {
    createCv(cv: $cv) {
      ${Queries.CV_QUERY}
    }
  }
`;

type CreateCvMutationResult = { createCv: Cv };

type CreateCvMutationVariables = {
  cv: { userId: string; name: string; eduction?: string; description: string };
};

export type CreateCvData = Cv;

export type CreateCvError = HttpError;

export type CreateCvParams = {
  userId: string;
  cv: {
    name: string;
    description: string;
    education?: string;
  };
};

export type CreateCvResult = HttpResult<CreateCvData, CreateCvError>;

export async function createCv(params: CreateCvParams): Promise<CreateCvResult> {
  const result = await graphQlClient
    .request<CreateCvMutationResult, CreateCvMutationVariables>({
      document: CREATE_CV,
      variables: {
        cv: { userId: params.userId, ...params.cv },
      },
    })
    .then(getHandleResult('createCv'))
    .catch(handleAuthError)
    .catch(getHandleException('Creating CV failed'));
  return result;
}
