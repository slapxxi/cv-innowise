import type { User } from 'cv-graphql';
import { getAuthClient, gql } from '~/shared';

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
  const response = await getAuthClient<{ users: User[] }>(getUsersQuery);
  return response.users;
};
