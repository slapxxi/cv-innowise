import { gql, graphQLClient } from '~/shared';
import type { User } from 'cv-graphql';

const getUsersQuery = gql`
  query Users {
    users {
      id
      email
      profile {
        id
        first_name
        last_name
        full_name
        avatar
      }
      department_name
      position_name
      role
    }
  }
`;

export const getUsers = async (): Promise<User[]> => {
  const response = await graphQLClient.request<{ users: User[] }>(getUsersQuery);
  return response.users;
};
