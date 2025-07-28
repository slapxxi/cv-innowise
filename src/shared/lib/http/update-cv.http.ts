import type { Cv, HttpError, HttpResult } from '~/shared';
import { API_URL } from './const';
import { ClientError, gql, request } from './graphql.http';
import { Queries } from './queries';
import { errorsSchema } from './schema';

const UPDATE_CV = gql`
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      ${Queries.CV_QUERY}
    }
  }
`;

type UpdateCvMutationResult = { updateCv: Cv };

type UpdateCvMutationVariables = {
  cv: { cvId: string; name: string; education?: string; description: string };
};

export type UpdateCvData = Cv;

export type UpdateCvError = HttpError;

export type UpdateCvParams = {
  cvId: string;
  cv: {
    name: string;
    description: string;
    education?: string;
  };
  accessToken: string;
};

export type UpdateCvResult = HttpResult<UpdateCvData, UpdateCvError>;

export async function updateCv(params: UpdateCvParams): Promise<UpdateCvResult> {
  try {
    const response = await request<UpdateCvMutationResult, UpdateCvMutationVariables>({
      url: API_URL,
      document: UPDATE_CV,
      variables: {
        cv: { cvId: params.cvId, ...params.cv },
      },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.updateCv };
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
