import { useMutation } from '@tanstack/react-query';
import type { AuthInput, AuthResult } from 'cv-graphql';
import { graphQLClient } from '~/shared/api/graphql.ts';
import { useNavigate } from '@tanstack/react-router';
import type { GraphQLResponseError } from '~/shared/types/graphql.types.ts';

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
  const navigate = useNavigate();
  return useMutation<AuthResult, Error, AuthInput>({
    mutationFn: async (auth: AuthInput) => {
      const response = await graphQLClient.request<{ login: AuthResult }>(LOGIN_QUERY, { auth });
      return response.login;
    },
    onSuccess: (response) => {
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
      navigate({ to: '/' });
    },
    onError: (error: GraphQLResponseError) => {
      console.log(error.response?.errors[0].message);
    },
  });
};
