import type { AuthResult, UpdateTokenResult, User } from 'cv-graphql';
import type { Prettify, Result } from '~/shared';

export type HttpError = {
  message: string;
  status?: number;
  errors?: string[];
};

export type HttpResult<TData, TError> = Result<TData, TError>;

export type AuthResponse = Prettify<AuthResult>;

export type UpdateTokenResponse = Prettify<UpdateTokenResult>;

export type GetUsersResponse = Prettify<{ users: User[] }>;
