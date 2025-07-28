import { ClientError, gql, request, type Cv, type HttpError, type HttpResult } from '~/shared';
import { API_URL, StatusCodes } from './const';
import { Queries } from './queries';

const GET_CV = gql`
  query Cv($cvId: ID!) {
    cv(cvId: $cvId) {
      ${Queries.CV_QUERY}
    }
  }
`;

type GetCvQueryResult = { cv: Cv };

type GetCvQueryVariables = {
  cvId: string;
};

export type GetCvData = Cv;

export type GetCvError = HttpError;

export type GetCvParams = {
  id: string;
  accessToken: string;
};

export type GetCvResult = HttpResult<GetCvData, GetCvError>;

export const getCv = async (params: GetCvParams): Promise<GetCvResult> => {
  try {
    const response = await request<GetCvQueryResult, GetCvQueryVariables>({
      url: API_URL,
      document: GET_CV,
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
      variables: { cvId: params.id },
    });
    return { ok: true, data: response.cv };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get CV failed' } };
  }
};
