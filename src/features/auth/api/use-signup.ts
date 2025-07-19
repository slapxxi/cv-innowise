import { useMutation } from '@tanstack/react-query';
import type { AuthInput, AuthResult } from 'cv-graphql';
import { graphQLClient } from '~/shared/api/graphql.ts';
import { useNavigate } from '@tanstack/react-router';
import type { GraphQLResponseError } from '~/shared/types/graphql.types.ts';

const SIGNUP_QUERY = `
  mutation Signup($auth:AuthInput!){
    signup(auth: $auth) {
      user {
        id
        email
      }
      access_token
    }
  }
`;

export const useSignupMutation = () => {
  const navigate = useNavigate();
  return useMutation<AuthResult, Error, AuthInput>({
    mutationFn: async (auth: AuthInput) => {
      const response = await graphQLClient.request<{ signup: AuthResult }>(SIGNUP_QUERY, { auth });
      return response.signup;
    },
    onSuccess: (response) => {
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
      }
      navigate({ to: '/auth/login' });
    },
    onError: (error: GraphQLResponseError) => {
      console.log(error.response?.errors[0].message);
    },
  });
};
