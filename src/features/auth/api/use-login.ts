import { useMutation } from '@tanstack/react-query';
import type { AuthInput, AuthResult } from 'cv-graphql';
import { graphQLClient } from '~/shared/api/graphql.ts';

const LOGIN_QUERY = `
  query Login($auth: AuthInput!) {
    login(auth: $auth) {
      access_token
      user {
        id
        email
      }
    }
  }
`;

export const useLoginMutation = () => {
  return useMutation<AuthResult, Error, AuthInput>({
    mutationFn: async (auth: AuthInput) => {
      const response = await graphQLClient.request<{ login: AuthResult }>(LOGIN_QUERY, { auth });
      console.log(response);
      return response.login;
    },
    onSuccess: (response) => {
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
  });
};
