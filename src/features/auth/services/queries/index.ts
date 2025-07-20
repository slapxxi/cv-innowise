import { gql } from '~/shared/lib/http/graphql.http.ts';

export const LOGIN_QUERY = `
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
export const SIGNUP_QUERY = gql`
  mutation Signup($auth: AuthInput!) {
    signup(auth: $auth) {
      user {
        id
        email
      }
      access_token
    }
  }
`;
