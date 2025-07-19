import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { AuthInput, AuthResult } from 'cv-graphql';
import { graphQLClient, type GraphQLResponseError } from '~/shared';

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
