import { GraphQLClient, ClientError } from 'graphql-request';
import { refreshAccessToken } from '~/shared';

const API_URL = import.meta.env.VITE_API_URL;

function createClient(token?: string): GraphQLClient {
  return new GraphQLClient(API_URL, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
}

export async function getAuthClient<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  let token = localStorage.getItem('access_token');
  let client = createClient(token ?? undefined);

  try {
    return await client.request<T>(query, variables);
  } catch (error) {
    const is401 =
      error instanceof ClientError && error.response?.errors?.some((e) => e.extensions?.code === 'UNAUTHENTICATED');

    if (!is401) throw error;

    console.warn('  Access token expired — refreshing...');
    try {
      token = await refreshAccessToken();
      client = createClient(token);
      return await client.request<T>(query, variables);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      throw error;
    }
  }
}
