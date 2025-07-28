import { ClientError, gql, request, type HttpError, type HttpResult, type Position } from '~/shared';
import { API_URL, StatusCodes } from './const';
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

export type GetPositionsParams = {
  accessToken: string;
};

export type GetPositionsResult = HttpResult<GetPositionsData, GetPositionsError>;

export const getPositions = async (params: GetPositionsParams): Promise<GetPositionsResult> => {
  try {
    const response = await request<GetPositionsQueryResult>({
      url: API_URL,
      document: GET_POSITIONS,
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
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
