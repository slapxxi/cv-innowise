import type { HttpError, HttpResult, UploadAvatarInput } from '~/shared';
import { gql, graphQlClient } from './graphql.http';
import { getHandleException, getHandleResult, handleAuthError } from './utils';

export type UploadAvatarParams = UploadAvatarInput;

type UploadAvatarVariables = {
  avatar: UploadAvatarInput;
};

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
  const response = await graphQlClient
    .request<UploadAvatarResponse, UploadAvatarVariables>({
      document: UPLOAD_AVATAR,
      variables: { avatar: params },
    })
    .then(getHandleResult('uploadAvatar'))
    .catch(handleAuthError)
    .catch(getHandleException('Avatar upload failed'));
  return response;
}
