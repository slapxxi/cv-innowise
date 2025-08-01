import { useMutation } from '@tanstack/react-query';
import { useAuth } from '~/app';
import { exportPdf, prepareHtml } from '~/shared';

type ExportPdfInput = {
  html: string;
  margin?: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
};

const downloadPdf = (base64: string, name = 'cv-export') => {
  const source = `data:application/pdf;base64,${base64}`;
  const link = document.createElement('a');
  link.href = source;
  link.download = `${name}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const useExportPdf = () => {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (input: ExportPdfInput) => {
      if (!auth?.accessToken) throw new Error('Not authenticated');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = input.html;
      const htmlWithStyles = prepareHtml(tempDiv);

      const result = await exportPdf({
        input: {
          html: htmlWithStyles,
          margin: input.margin,
        },
        accessToken: auth.accessToken,
      });
      if (!result.ok) {
        throw new Error(result.error.message || 'Failed to export PDF');
      }

      return result.data;
    },
    onSuccess: (base64: string) => {
      downloadPdf(base64);
    },
    onError: (error: Error) => {
      console.error('Failed to export PDF:', error);
    },
  });
};
