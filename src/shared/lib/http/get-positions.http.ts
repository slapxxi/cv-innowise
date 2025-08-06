import { type HttpError, type HttpResult, type Position } from '~/shared';
import { StatusCodes } from './const';
import { ClientError, gql, graphQlClient } from './graphql.http';
import { Queries } from './queries';

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
  try {
    const response = await graphQlClient.request<GetPositionsQueryResult>({
      document: GET_POSITIONS,
    });
    return { ok: true, data: response.positions };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get positions failed' } };
  }
};
