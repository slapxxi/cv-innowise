import { ClientError, gql, request, type Cv, type HttpError, type HttpResult } from '~/shared';
import { API_URL, StatusCodes } from './const';
import { Queries } from './queries';

const GET_CVS = gql`
  query Cvs {
    cvs {
      ${Queries.CV_QUERY}
    }
  }
`;

type GetCvsQueryResult = {
  cvs: Cv[];
};

export type GetCvsData = Cv[];

export type GetCvsError = HttpError;

export type GetCvsParams = {
  accessToken: string;
};

export type GetCvsResult = HttpResult<GetCvsData, GetCvsError>;

export const getCvs = async (params: GetCvsParams): Promise<GetCvsResult> => {
  try {
    const response = await request<GetCvsQueryResult>({
      url: API_URL,
      document: GET_CVS,
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.cvs };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get cvs failed' } };
  }
};
