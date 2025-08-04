import { type Department, type HttpError, type HttpResult } from '~/shared';
import { StatusCodes } from './const';
import { ClientError, gql, graphQlClient } from './graphql.http';
import { Queries } from './queries';

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
  try {
    const response = await graphQlClient.request<GetDepartmentsQueryResult>({
      document: GET_Departments,
    });
    return { ok: true, data: response.departments };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get departments failed' } };
  }
};
