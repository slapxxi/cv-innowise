import type { Mastery as BaseMastery, User as CVUser } from 'cv-graphql';
import type { Prettify } from '~/shared';

export type User = Prettify<CVUser>;

export type Auth = {
  user: User;
  accessToken: string;
} | null;

export type Mastery = Prettify<BaseMastery>;

export type MasteryLevel = Lowercase<`${Mastery}`>;
