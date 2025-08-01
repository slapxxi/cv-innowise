import type { Cv, HttpError, HttpResult } from '~/shared';
import { API_URL } from '../const';
import { ClientError, gql, request } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';

const CREATE_CV = gql`
  mutation AddCv($cv: CreateCvInput!) {
    createCv(cv: $cv) {
      ${Queries.CV_QUERY}
    }
  }
`;

type CreateCvMutationResult = { createCv: Cv };

type CreateCvMutationVariables = {
  cv: { userId: string; name: string; eduction?: string; description: string };
};

export type CreateCvData = Cv;

export type CreateCvError = HttpError;

export type CreateCvParams = {
  userId: string;
  cv: {
    name: string;
    description: string;
    education?: string;
  };
  accessToken: string;
};

export type CreateCvResult = HttpResult<CreateCvData, CreateCvError>;

export async function createCv(params: CreateCvParams): Promise<CreateCvResult> {
  try {
    const response = await request<CreateCvMutationResult, CreateCvMutationVariables>({
      url: API_URL,
      document: CREATE_CV,
      variables: {
        cv: { userId: params.userId, ...params.cv },
      },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.createCv };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'CV creating failed' } };
  }
}
