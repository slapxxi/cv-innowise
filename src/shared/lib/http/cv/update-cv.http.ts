import type { Cv, HttpError, HttpResult, UpdateCvInput } from '~/shared';
import { ClientError, gql, graphQlClient } from '../graphql.http';
import { Queries } from '../queries';
import { errorsSchema } from '../schema';

const UPDATE_CV = gql`
  mutation UpdateCv($cv: UpdateCvInput!) {
    updateCv(cv: $cv) {
      ${Queries.CV_QUERY}
    }
  }
`;

type UpdateCvMutationResult = { updateCv: Cv };

type UpdateCvMutationVariables = {
  cv: UpdateCvInput;
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
};

export type UpdateCvResult = HttpResult<UpdateCvData, UpdateCvError>;

export async function updateCv(params: UpdateCvParams): Promise<UpdateCvResult> {
  try {
    const response = await graphQlClient.request<UpdateCvMutationResult, UpdateCvMutationVariables>({
      document: UPDATE_CV,
      variables: {
        cv: { cvId: params.cvId, ...params.cv },
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
