import { type Cv, type HttpError, type HttpResult } from '~/shared';
import { gql, graphQlClient } from '../graphql.http';
import { getHandleException, getHandleResult, handleAuthError } from '../utils';

const GET_CVS = gql`
  query Cvs {
    cvs {
      id
      name
      description
      education
      user {
        id
        email
      }
    }
  }
`;

type GetCvsQueryResult = {
  cvs: Cv[];
};

export type GetCvsData = Cv[];

export type GetCvsError = HttpError;

export type GetCvsResult = HttpResult<GetCvsData, GetCvsError>;

export const getCvs = async (): Promise<GetCvsResult> => {
  const result = await graphQlClient
    .request<GetCvsQueryResult>({
      document: GET_CVS,
    })
    .then(getHandleResult('cvs'))
    .catch(handleAuthError)
    .catch(getHandleException('Get CV failed'));
  return result;
};
