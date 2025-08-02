import type { UploadAvatarInput } from 'cv-graphql';
import type { HttpError, HttpResult } from '~/shared';
import { API_URL } from './env';
import { ClientError, gql, request } from './graphql.http';
import { errorsSchema } from './schema';

export type UploadAvatarParams = UploadAvatarInput & { accessToken?: string };

export type UploadAvatarResult = HttpResult<string, HttpError>;

type UploadAvatarResponse = {
  uploadAvatar: string;
};
const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($avatar: UploadAvatarInput!) {
    uploadAvatar(avatar: $avatar)
  }
`;

export async function uploadAvatar(params: UploadAvatarParams): Promise<UploadAvatarResult> {
  try {
    const { accessToken, ...avatar } = params;

    const response = await request<UploadAvatarResponse>({
      url: API_URL,
      document: UPLOAD_AVATAR,
      variables: { avatar },
      requestHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return { ok: true, data: response.uploadAvatar };
  } catch (e) {
    if (e instanceof ClientError) {
      const parseResult = errorsSchema.safeParse(e.response);

      if (parseResult.success) {
        return { ok: false, error: { message: e.message, errors: parseResult.data.errors } };
      }
    }

    return { ok: false, error: { message: 'Avatar upload failed' } };
  }
}
