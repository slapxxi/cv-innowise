import { type Department, type HttpError, type HttpResult, type Position } from '~/shared';
import { StatusCodes } from '../const';
import { ClientError, gql, graphQlClient } from '../graphql.http';
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

export async function fetchUserFormData(): Promise<FormDataResult> {
  try {
    const response = await graphQlClient.request<GetFormDataQueryResult>({
      document: FORM_DATA_QUERY,
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
