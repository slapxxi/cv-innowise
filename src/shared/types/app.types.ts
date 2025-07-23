import type {
  Mastery as BaseMastery,
  Skill as CVSkill,
  SkillCategory as CVSkillCategory,
  SkillMastery as CVSkillMastery,
  User as CVUser,
  Profile as CVProfile,
} from 'cv-graphql';
import type { Prettify } from '~/shared';

export type Profile = Prettify<CVProfile>;

export type User = Prettify<CVUser>;

export type Skill = Prettify<CVSkill>;

export type SkillMastery = Prettify<CVSkillMastery>;

export type UserWithSkillsByCategories = Prettify<
  User & {
    skillsByCategories: Record<SkillCategory['name'], SkillMastery[]> | null;
  }
>;

export type SkillCategory = Prettify<CVSkillCategory>;

export type Auth = {
  user: User;
  accessToken: string;
} | null;

export type Mastery = Prettify<BaseMastery>;

export type MasteryLevel = `${Mastery}`;
