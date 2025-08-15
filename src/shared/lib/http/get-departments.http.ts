import { type Department, type HttpError, type HttpResult } from '~/shared/types';
import { gql, graphQlClient } from './graphql.http';
import { Queries } from './queries';
import { getHandleException, getHandleResult, handleAuthError } from './utils';

const GET_Departments = gql`
  query Departments {
    departments {
      ${Queries.DEPARTMENT_QUERY}
    }
  }
`;

type GetDepartmentsQueryResult = {
  departments: Department[];
};

export type GetDepartmentsData = Department[];

export type GetDepartmentsError = HttpError;

export type GetDepartmentsResult = HttpResult<GetDepartmentsData, GetDepartmentsError>;

export const getDepartments = async (): Promise<GetDepartmentsResult> => {
  const result = await graphQlClient
    .request<GetDepartmentsQueryResult>({
      document: GET_Departments,
    })
    .then(getHandleResult('departments'))
    .catch(handleAuthError)
    .catch(getHandleException('Get departments failed'));
  return result;
};
