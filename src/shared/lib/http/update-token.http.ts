import { ClientError, request } from 'graphql-request';
import type { HttpError, HttpResult, UpdateTokenResponse } from '~/shared';
import { Queries } from './queries';
import { StatusCodes } from './const';

const API_URL = import.meta.env.VITE_API_URL;

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
  try {
    const response = await request<UpdateTokenMutationResult>({
      url: API_URL,
      document: REFRESH_TOKEN_MUTATION,
      requestHeaders: {
        Authorization: `Bearer ${params.refreshToken}`,
      },
    });
    const { refresh_token: refreshToken, access_token: accessToken } = response.updateToken;
    return { ok: true, data: { accessToken, refreshToken } };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }

    return { ok: false, error: { message: 'Update token failed' } };
  }
}
