import type { RemoveCvProjectInput } from 'cv-graphql';
import type { Prettify, Result, User } from '~/shared';

export type HttpError = {
  message: string;
  status?: number;
  errors?: string[];
};

export type HttpResult<TData, TError> = Result<TData, TError>;

export type UpdateTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type GetUsersResponse = { users: User[] };

export type DeleteCvProjectInput = Prettify<RemoveCvProjectInput>;
