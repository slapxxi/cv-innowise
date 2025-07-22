import type { UpdateTokenResult } from 'cv-graphql';
import { GraphQLClient } from 'graphql-request';
import { getCookie, setCookie } from 'typescript-cookie';

export { ClientError, gql, request } from 'graphql-request';

const API_URL = import.meta.env.VITE_API_URL;

export const unAuthClient = new GraphQLClient(API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});
const REFRESH_TOKEN_MUTATION = `
  mutation {
    updateToken {
      access_token
      refresh_token
    }
  }
`;

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getCookie('refresh_token');
  if (!refreshToken) throw new Error('No refresh token');
  const graphQLClient = new GraphQLClient(API_URL, {
    headers: {
      Authorization: refreshToken ? `Bearer ${refreshToken}` : '',
    },
  });
  const { updateToken } = await graphQLClient.request<{ updateToken: UpdateTokenResult }>(REFRESH_TOKEN_MUTATION);

  localStorage.setItem('access_token', updateToken.access_token);

  setCookie('refresh_token', updateToken.refresh_token, {
    sameSite: 'strict',
    secure: true,
    path: '/',
    expires: 7,
  });

  return updateToken.access_token;
}
