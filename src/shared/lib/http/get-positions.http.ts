import { type HttpError, type HttpResult, type Position } from '../../types';
import { gql, graphQlClient } from './graphql.http';
import { Queries } from './queries';
import { getHandleException, getHandleResult, handleAuthError } from './utils';

const GET_POSITIONS = gql`
  query Positions {
    positions {
      ${Queries.POSITION_QUERY}
    }
  }
`;

type GetPositionsQueryResult = {
  positions: Position[];
};

export type GetPositionsData = Position[];

export type GetPositionsError = HttpError;

export type GetPositionsResult = HttpResult<GetPositionsData, GetPositionsError>;

export const getPositions = async (): Promise<GetPositionsResult> => {
  const result = await graphQlClient
    .request<GetPositionsQueryResult>({
      document: GET_POSITIONS,
    })
    .then(getHandleResult('positions'))
    .catch(handleAuthError)
    .catch(getHandleException('Get positions failed'));
  return result;
};
