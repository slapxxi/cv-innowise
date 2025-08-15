import { type HttpError, type HttpResult, type Language } from '../../types';
import { gql, graphQlClient } from './graphql.http';
import { Queries } from './queries';
import { getHandleException, getHandleResult, handleAuthError } from './utils';

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
  const result = await graphQlClient
    .request<GetLanguagesQueryResult>({
      document: GET_LANGUAGES,
    })
    .then(getHandleResult('languages'))
    .catch(handleAuthError)
    .catch(getHandleException('Get languages failed'));
  return result;
};
