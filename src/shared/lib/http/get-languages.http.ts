import { type HttpError, type HttpResult, type Language } from '~/shared';
import { gql, ClientError, request } from './graphql.http';
import { StatusCodes } from './const';
import { API_URL } from './env';
import { Queries } from './queries';

const GET_LANGUAGES = gql`
  query Languages {
    languages {
      ${Queries.LANGUAGE_QUERY}
    }
  }
`;

type GetLanguagesQueryResult = {
  languages: Language[];
};

export type GetLanguagesData = Language[];

export type GetLanguagesError = HttpError;

export type GetLanguagesParams = {
  accessToken: string;
};

export type GetLanguagesResult = HttpResult<GetLanguagesData, GetLanguagesError>;

export const getLanguages = async (params: GetLanguagesParams): Promise<GetLanguagesResult> => {
  try {
    const response = await request<GetLanguagesQueryResult>({
      url: API_URL,
      document: GET_LANGUAGES,
      requestHeaders: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    });
    return { ok: true, data: response.languages };
  } catch (e) {
    if (e instanceof ClientError) {
      if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
        return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
      }
    }
    return { ok: false, error: { message: 'Get languages failed' } };
  }
};
