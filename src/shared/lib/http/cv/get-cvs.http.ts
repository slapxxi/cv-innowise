import { type Cv, type HttpError, type HttpResult } from '~/shared';
import { StatusCodes } from '../const';
import { ClientError, gql, graphQlClient } from '../graphql.http';

const GET_CVS = gql`
  query Cvs {
    cvs {
      id
      name
      description
      education
      user {
        id
        email
      }
    }
  }
`;

type GetCvsQueryResult = {
  cvs: Cv[];
};

export type GetCvsData = Cv[];

export type GetCvsError = HttpError;

export type GetCvsResult = HttpResult<GetCvsData, GetCvsError>;

export const getCvs = async (): Promise<GetCvsResult> => {
  try {
    const response = await graphQlClient.request<GetCvsQueryResult>({
      document: GET_CVS,
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
