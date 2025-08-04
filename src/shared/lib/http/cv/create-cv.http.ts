import type { Cv, HttpError, HttpResult } from '~/shared';
import { ClientError, gql, graphQlClient } from '../graphql.http';
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
};

export type CreateCvResult = HttpResult<CreateCvData, CreateCvError>;

export async function createCv(params: CreateCvParams): Promise<CreateCvResult> {
  try {
    const response = await graphQlClient.request<CreateCvMutationResult, CreateCvMutationVariables>({
      document: CREATE_CV,
      variables: {
        cv: { userId: params.userId, ...params.cv },
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
