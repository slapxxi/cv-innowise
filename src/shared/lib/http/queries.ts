import { gql } from './graphql.http';

const REFRESH_TOKEN = gql`
  accessToken: access_token
  refreshToken: refresh_token
`;

const SKILL_CATEGORY_QUERY = gql`
  id
  name
  order
  parent {
    id
  }
  children {
    id
  }
`;

const SKILL_MASTERY_QUERY = gql`
  name
  categoryId
  mastery
`;

const SKILL_QUERY = gql`
  id
  createdAt: created_at
  name
  categoryName: category_name
  categoryParentName: category_parent_name
  category {
    id
    name
    parent {
      id
      name
    }
  }
`;

const PROJECT_QUERY = gql`
  id
  createdAt: created_at
  name
  internalName: internal_name
  domain
  startDate: start_date
  endDate: end_date
  description
  environment
`;

const CVPROJECT_QUERY = gql`
  id
  project {
    id
  }
  name
  internalName: internal_name
  description
  domain
  startDate: start_date
  endDate: end_date
  environment
  roles
  responsibilities
`;

const POSITION_QUERY = gql`
  id
  createdAt: created_at
  name
`;

const LANGUAGE_QUERY = gql`
  id
  createdAt: created_at
  name
  nativeName: native_name
  iso2
`;

const LANGUAGE_PROFICIENCY_QUERY = gql`
  name
  proficiency
`;

const PROFILE_QUERY = gql`
  id
  createdAt: created_at
  firstName: first_name
  lastName: last_name
  fullName: full_name
  avatar
  skills {
    ${SKILL_MASTERY_QUERY}
  }
  languages {
    ${LANGUAGE_PROFICIENCY_QUERY}
  }
`;

const CV_QUERY = gql`
  id
  createdAt: created_at
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
  name
  createdAt: created_at
`;

const USER_QUERY = gql`
  id
  email
  createdAt: created_at
  isVerified: is_verified
  departmentName: department_name
  positionName: position_name
  profile {
    ${PROFILE_QUERY}
  }
  cvs {
    ${CV_QUERY}
  }
  department {
    ${DEPARTMENT_QUERY}
  }
  position {
    ${POSITION_QUERY}
  }
  role
`;

export const Queries = {
  USER_QUERY,
  CVPROJECT_QUERY,
  PROJECT_QUERY,
  SKILL_QUERY,
  SKILL_MASTERY_QUERY,
  SKILL_CATEGORY_QUERY,
  POSITION_QUERY,
  LANGUAGE_QUERY,
  PROFILE_QUERY,
  CV_QUERY,
  DEPARTMENT_QUERY,
  REFRESH_TOKEN,
};
