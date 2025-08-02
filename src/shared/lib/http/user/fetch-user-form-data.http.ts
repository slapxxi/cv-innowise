import { type Department, type HttpError, type HttpResult, type Position } from '~/shared';
import { StatusCodes } from '../const';
import { API_URL } from '../env';
import { ClientError, gql, request } from '../graphql.http';
import { Queries } from '../queries';

type FormDataError = HttpError;
type FormDataResult = HttpResult<{ departments: Department[]; positions: Position[] }, FormDataError>;

type GetFormDataQueryResult = {
  departments: Department[];
  positions: Position[];
};

export type FormDataParams = {
  accessToken: string;
};

const FORM_DATA_QUERY = gql`
  query GetDepartmentsAndPositions {
    departments {
      ${Queries.DEPARTMENT_QUERY}
    }
    positions {
      ${Queries.POSITION_QUERY}
    }
  }
`;

export async function fetchUserFormData(params: FormDataParams): Promise<FormDataResult> {
  try {
    const response = await request<GetFormDataQueryResult>({
      url: API_URL,
      document: FORM_DATA_QUERY,
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return {
      ok: true,
      data: {
        departments: response.departments,
        positions: response.positions,
      },
    };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'form data fetch error' } };
  }
}
