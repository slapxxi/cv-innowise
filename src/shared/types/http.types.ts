import { type AuthResult as CVAuthResult } from 'cv-graphql';
import type { Prettify, Result } from '~/shared';

export type HttpError = {
  message: string;
  errors?: string[];
};

export type HttpResult<TData, TError> = Result<TData, TError>;

export type AuthResult = Prettify<CVAuthResult>;
