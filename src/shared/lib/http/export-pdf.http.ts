import { ClientError, gql, request, type HttpError, type HttpResult } from '~/shared';
import { API_URL, StatusCodes } from './const';

export type MarginInput = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

export type ExportPdfInput = {
  html: string;
  margin?: MarginInput;
};

export type ExportPdfData = string;

export type ExportPdfError = HttpError;

export type ExportPdfParams = {
  input: ExportPdfInput;
  accessToken: string;
};

export type ExportPdfResult = HttpResult<ExportPdfData, ExportPdfError>;

const EXPORT_PDF = gql`
  mutation ExportPdf($pdf: ExportPdfInput!) {
    exportPdf(pdf: $pdf)
  }
`;

export const exportPdf = async (params: ExportPdfParams): Promise<ExportPdfResult> => {
  try {
    const response = await request<{ exportPdf: string }>({
      url: API_URL,
      document: EXPORT_PDF,
      requestHeaders: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      },
      variables: {
        pdf: params.input,
      },
    });

    return { ok: true, data: response.exportPdf };
  } catch (e) {
    if (e instanceof Error) {
      if (e instanceof ClientError) {
        if (e.response.errors?.find((e) => e.message.toLowerCase() === 'unauthorized')) {
          return { ok: false, error: { message: 'Unauthorized', status: StatusCodes.UNAUTHORIZED } };
        }
      }
      return {
        ok: false,
        error: {
          message: e.message || 'Failed to export PDF',
        },
      };
    }
    return {
      ok: false,
      error: {
        message: 'An unknown error occurred while exporting PDF',
      },
    };
  }
};
