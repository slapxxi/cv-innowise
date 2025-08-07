import { type HttpError, type HttpResult } from '~/shared';
import { gql, graphQlClient } from './graphql.http';
import { getHandleException, getHandleResult, handleAuthError } from './utils';

export type MarginInput = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

type ExportPdfQueryResult = {
  exportPdf: string;
};

export type ExportPdfInput = {
  html: string;
  margin?: MarginInput;
};

export type ExportPdfData = string;

export type ExportPdfError = HttpError;

export type ExportPdfParams = {
  input: ExportPdfInput;
};

export type ExportPdfResult = HttpResult<ExportPdfData, ExportPdfError>;

const EXPORT_PDF = gql`
  mutation ExportPdf($pdf: ExportPdfInput!) {
    exportPdf(pdf: $pdf)
  }
`;

export const exportPdf = async (params: ExportPdfParams): Promise<ExportPdfResult> => {
  const result = await graphQlClient
    .request<ExportPdfQueryResult>({
      document: EXPORT_PDF,
      requestHeaders: {
        'Content-Type': 'application/json',
      },
      variables: {
        pdf: params.input,
      },
    })
    .then(getHandleResult('exportPdf'))
    .catch(handleAuthError)
    .catch(getHandleException('Failed to export PDF'));
  return result;
};
