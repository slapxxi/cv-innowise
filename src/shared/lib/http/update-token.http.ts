import type { HttpError, HttpResult, UpdateTokenResponse } from '~/shared';
import { API_URL } from './env';
import { request } from './graphql.http';
import { Queries } from './queries';
import { getHandleException, getHandleResult, handleAuthError } from './utils';

const REFRESH_TOKEN_MUTATION = `
  mutation {
    updateToken {
      ${Queries.REFRESH_TOKEN}
    }
  }
`;

type UpdateTokenMutationResult = {
  updateToken: UpdateTokenResponse;
};

export type UpdateTokenData = {
  accessToken: string;
  refreshToken: string;
};

export type UpdateTokenError = HttpError;

export type UpdateTokenParams = {
  refreshToken: string;
};

export type UpdateTokenResult = HttpResult<UpdateTokenData, UpdateTokenError>;

export async function updateToken(params: UpdateTokenParams): Promise<UpdateTokenResult> {
  const result = await request<UpdateTokenMutationResult>({
    url: API_URL,
    document: REFRESH_TOKEN_MUTATION,
    requestHeaders: {
      Authorization: `Bearer ${params.refreshToken}`,
    },
  })
    .then(getHandleResult('updateToken'))
    .catch(handleAuthError)
    .catch(getHandleException('Update token failed'));
  return result;
}
