import { GraphQLClient, type RequestMiddleware } from 'graphql-request';
import { API_URL } from './env';
import { queryClient } from '../tanstack-query.lib';
import { authOptions, isAuthExpired, refreshAuth, type AuthData } from '~/features';

export { ClientError, gql, request } from 'graphql-request';

const requestMiddleware: RequestMiddleware = async (req) => {
  // @ts-expect-error Type 'Request' is not assignable to type 'RequestInit'.
  const headers = Object.fromEntries(req.headers);
  const auth: AuthData = queryClient.getQueryData(authOptions().queryKey) as AuthData;

  if (auth) {
    let freshAuth = auth;

    if (isAuthExpired(auth)) {
      const result = await refreshAuth();

      if (result) {
        freshAuth = result;
        queryClient.setQueryData(authOptions().queryKey, freshAuth);
      }
    }

    return { ...req, headers: { ...headers, authorization: `Bearer ${freshAuth.accessToken}` } };
  }

  return req;
};

export const graphQlClient = new GraphQLClient(API_URL, { requestMiddleware });
