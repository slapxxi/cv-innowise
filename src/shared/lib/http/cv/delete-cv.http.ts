import type { HttpError, HttpResult } from '~/shared';
import { ClientError, gql, graphQlClient } from '../graphql.http';
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
};

export type DeleteCvResult = HttpResult<DeleteCvData, DeleteCvError>;

export async function deleteCv(params: DeleteCvParams): Promise<DeleteCvResult> {
  try {
    const response = await graphQlClient.request<DeleteCvsMutationResult, DeleteCvsMutationVariables>({
      document: DELETE_gc_SKILL,
      variables: { cv: { cvId: params.cvId } },
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
