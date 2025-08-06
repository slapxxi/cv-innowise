import type { UploadAvatarInput } from 'cv-graphql';
import type { HttpError, HttpResult } from '~/shared';
import { ClientError, gql, graphQlClient } from './graphql.http';
import { errorsSchema } from './schema';

export type UploadAvatarParams = UploadAvatarInput;

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
    const { ...avatar } = params;

    const response = await graphQlClient.request<UploadAvatarResponse>({
      document: UPLOAD_AVATAR,
      variables: { avatar },
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
