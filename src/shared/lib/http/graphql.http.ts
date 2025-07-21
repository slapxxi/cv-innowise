import { GraphQLClient } from 'graphql-request';

export { ClientError, gql } from 'graphql-request';

// todo: move to env
const API_URL = 'https://cv-project-js.inno.ws/api/graphql';

export const graphQLClient = new GraphQLClient(API_URL, {
  headers: () => {
    const accessToken = sessionStorage.getItem('access_token');
    return {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    };
  },
});
