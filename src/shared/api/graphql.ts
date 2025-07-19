import { GraphQLClient } from 'graphql-request';

const API_URL = 'https://cv-project-js.inno.ws/api/graphql';

export const graphQLClient = new GraphQLClient(API_URL, {
  headers: () => ({
    Authorization: localStorage.getItem('access_token') ? `Bearer ${localStorage.getItem('access_token')}` : '',
  }),
});
