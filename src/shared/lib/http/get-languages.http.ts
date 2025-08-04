import { type HttpError, type HttpResult, type Language } from '~/shared';
import { StatusCodes } from './const';
import { ClientError, gql, graphQlClient } from './graphql.http';
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

export type GetLanguagesResult = HttpResult<GetLanguagesData, GetLanguagesError>;

export const getLanguages = async (): Promise<GetLanguagesResult> => {
  try {
    const response = await graphQlClient.request<GetLanguagesQueryResult>({
      document: GET_LANGUAGES,
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
