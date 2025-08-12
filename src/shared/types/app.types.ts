import type { Nullable } from '~/shared';
import 'cv-graphql';

export type WithSkillsByCategories<T> = T & {
  skillsByCategories: Record<SkillCategory['name'], SkillMastery[]> | null;
};

export type BreadcrumbEntry = {
  title: string;
  to?: string;
  icon?: React.ReactNode;
  props?: Record<string, unknown>;
};

export type SortOrder = 'asc' | 'desc';

export type ChangeSortHandler = (sort: string, order: SortOrder) => void;

export type Auth = {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  isFetching: boolean;
  isAuthenticated: () => boolean;
  logout: () => void;
};

export type Proficiency = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';

export type Mastery = 'Novice' | 'Advanced' | 'Competent' | 'Proficient' | 'Expert';

export type User = {
  id: string;
  createdAt: string;
  email: string;
  isVerified: boolean;
  profile: Profile;
  cvs?: Nullable<Cv[]>;
  department?: Nullable<Department>;
  departmentName?: Nullable<string>;
  position?: Nullable<Position>;
  positionName?: Nullable<string>;
  role: UserRole;
};

export type UserWithSkillsByCategories = WithSkillsByCategories<User>;

export type UserRole = 'Employee' | 'Admin';

export type Profile = {
  id: string;
  createdAt: string;
  firstName?: Nullable<string>;
  lastName?: Nullable<string>;
  fullName?: Nullable<string>;
  avatar?: Nullable<string>;
  skills: SkillMastery[];
  languages: LanguageProficiency[];
};

export type Cv = {
  id: string;
  createdAt: string;
  name: string;
  education?: Nullable<string>;
  description: string;
  user?: Nullable<{ id: string; email: string }>;
  projects?: Nullable<CvProject[]>;
  skills: SkillMastery[];
  languages: LanguageProficiency[];
};

export type CvWithSkillsByCategories = WithSkillsByCategories<Cv>;

export type Department = {
  id: string;
  createdAt: string;
  name: string;
};

export type Language = {
  id: string;
  createdAt: string;
  iso2: string;
  name: string;
  nativeName?: Nullable<string>;
};

export type Position = {
  id: string;
  createdAt: string;
  name: string;
};

export type CvProject = {
  id: string;
  project: Project;
  name: string;
  internalName: string;
  description: string;
  domain: string;
  startDate: string;
  endDate?: Nullable<string>;
  environment: string[];
  roles: string[];
  responsibilities: string[];
};

export interface SkillMastery {
  name: string;
  mastery: Mastery;
  categoryId?: Nullable<string>;
}

export type LanguageProficiency = {
  name: string;
  proficiency: Proficiency;
};

export interface Project {
  id: string;
  createdAt: string;
  name: string;
  internalName: string;
  domain: string;
  startDate: string;
  endDate?: Nullable<string>;
  description: string;
  environment: string[];
}

export interface Skill {
  id: string;
  createdAt: string;
  name: string;
  category?: Nullable<SkillCategory>;
  categoryName?: Nullable<string>;
  categoryParentName?: Nullable<string>;
}

export interface SkillCategory {
  id: string;
  name: string;
  order: number;
  parent?: Nullable<SkillCategory>;
  children: SkillCategory[];
}
