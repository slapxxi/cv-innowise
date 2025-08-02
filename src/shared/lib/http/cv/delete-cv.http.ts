import type { HttpError, HttpResult } from '~/shared';
import { API_URL } from '../env';
import { ClientError, gql, request } from '../graphql.http';
import { errorsSchema } from '../schema';

const DELETE_gc_SKILL = gql`
  mutation DeleteCv($cv: DeleteCvInput!) {
    deleteCv(cv: $cv) {
      affected
    }
  }
`;

type DeleteCvsMutationResult = { deleteCv: { affected: number } };

type DeleteCvsMutationVariables = { cv: { cvId: string } };

export type DeleteCvData = { affected: number };

export type DeleteCvError = HttpError;

export type DeleteCvParams = {
  cvId: string;
  accessToken: string;
};

export type DeleteCvResult = HttpResult<DeleteCvData, DeleteCvError>;

export async function deleteCv(params: DeleteCvParams): Promise<DeleteCvResult> {
  try {
    const response = await request<DeleteCvsMutationResult, DeleteCvsMutationVariables>({
      url: API_URL,
      document: DELETE_gc_SKILL,
      variables: { cv: { cvId: params.cvId } },
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.deleteCv };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Deleting Cv failed' } };
  }
}
