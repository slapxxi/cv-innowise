import type {
  RemoveCvProjectInput,
  UpdateCvProjectInput as CvUpdateCvProjectInput,
  UpdateCvInput as CvUpdateCvInput,
  UploadAvatarInput as CvUploadAvatarInput,
  UpdateProfileInput as CvUpdateProfileInput,
} from 'cv-graphql';
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

export type UpdateCvProjectInput = Prettify<CvUpdateCvProjectInput>;

export type UpdateCvInput = Prettify<CvUpdateCvInput>;

export type UploadAvatarInput = Prettify<CvUploadAvatarInput>;

export type UpdateProfileInput = Prettify<CvUpdateProfileInput>;
