import { gql } from './graphql.http';

const SKILL_MASTERY_QUERY = gql`
  name
  categoryId
  mastery
`;

const PROJECT_QUERY = gql`
  id
  created_at
  name
  internal_name
  domain
  start_date
  end_date
  description
  environment
`;

const CVPROJECT_QUERY = gql`
  id
  project {
    id
  }
  name
  internal_name
  description
  domain
  start_date
  end_date
  environment
  roles
  responsibilities
`;

const SKILL_QUERY = gql`
  name
  categoryId
  mastery
`;

const POSITION_QUERY = gql`
  id
  created_at
  name
`;

const LANGUAGE_QUERY = gql`
  name
  proficiency
`;

const PROFILE_QUERY = gql`
  id
  created_at
  first_name
  last_name
  full_name
  avatar
  skills {
    ${SKILL_QUERY}
  }
  languages {
    ${LANGUAGE_QUERY}
  }
`;

const CV_QUERY = gql`
  id
  created_at
  name
  education
  description
  user {
    id
  }
  projects {
    id
  }
`;

const DEPARTMENT_QUERY = gql`
  id
  created_at
  name
`;

const USER_QUERY = gql`
  id
  email
  created_at
  is_verified
  department_name
  position_name
  profile {
    ${PROFILE_QUERY}
  }
  cvs {
    ${CV_QUERY}
  }
  department {
    ${DEPARTMENT_QUERY}
  }
  department_name
  position {
    ${POSITION_QUERY}
  }
  position_name
  role
`;

export const QUERIES = {
  USER_QUERY,
  CVPROJECT_QUERY,
  PROJECT_QUERY,
  SKILL_MASTERY_QUERY,
  SKILL_QUERY,
  POSITION_QUERY,
  LANGUAGE_QUERY,
  PROFILE_QUERY,
  CV_QUERY,
  DEPARTMENT_QUERY,
};
