import { type Department, type HttpError, type HttpResult, type Position } from '~/shared/types';
import { gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { getHandleException, handleAuthError } from '../utils';

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
  const response = await graphQlClient
    .request<GetFormDataQueryResult>({
      document: FORM_DATA_QUERY,
    })
    .catch(handleAuthError)
    .catch(getHandleException('Fetch user form data failed'));

  if ('positions' in response) {
    return {
      ok: true,
      data: {
        departments: response.departments,
        positions: response.positions,
      },
    };
  }

  return response;
}
