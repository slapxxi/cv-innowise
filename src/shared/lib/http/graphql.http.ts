import { GraphQLClient, type RequestMiddleware } from 'graphql-request';
import type { AuthData } from '~/app';
import { isAuthExpired, refreshAuth } from '~/features';
import { queryClient } from '../tanstack-query.lib';
import { API_URL } from './env';

export { ClientError, gql, request } from 'graphql-request';

const requestMiddleware: RequestMiddleware = async (req) => {
  // @ts-expect-error Type 'Request' is not assignable to type 'RequestInit'.
  const headers = Object.fromEntries(req.headers);
  const auth: AuthData = queryClient.getQueryData(['auth']) as AuthData;

  if (auth) {
    let freshAuth = auth;

    if (isAuthExpired(auth)) {
      const result = await refreshAuth();

      if (result) {
        freshAuth = result;
        queryClient.setQueryData(['auth'], freshAuth);
      }
    }

    return { ...req, headers: { ...headers, authorization: `Bearer ${freshAuth.accessToken}` } };
  }

  return req;
};

export const graphQlClient = new GraphQLClient(API_URL, { requestMiddleware });
