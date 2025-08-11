import { theme } from '~/app/providers/theme.provider';

export const prepareStyles = (): HTMLStyleElement => {
  const style = document.createElement('style');
  const styleSheets = Array.from(document.styleSheets);

  const googleFonts = `
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
    `;

  const links = styleSheets.reduce<Node[]>((acc, styleSheet) => {
    try {
      // Skip external stylesheets that might cause CORS issues
      if (styleSheet.href && !styleSheet.href.startsWith(window.location.origin)) {
        return acc;
      }

      if (styleSheet.cssRules) {
        const style = document.createElement('style');
        style.innerHTML = Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
        acc.push(style);
      }
    } catch (e) {
      console.warn('Cannot load styles from stylesheet:', styleSheet.href, e);
    }
    return acc;
  }, []);

  const printStyles = document.createElement('style');
  printStyles.innerHTML = `
      ${googleFonts}
      
      @media print {
        /* Hide print-specific elements */
        .no-print {
          display: none !important;
        }
        th{
        border-bottom: 2px solid var(--color-primary);
        text-align: center;
        vertical-align: middle;

        }

        tr[data-last="true"] {
      border-bottom: 1px solid ${theme.palette.divider};
    }
      }
    `;
  links.push(printStyles);

  style.append(...links);
  return style;
};

export const prepareHtml = (content: HTMLElement): string => {
  const page = document.createElement('div');
  page.append(content.cloneNode(true), prepareStyles());
  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>CV Export</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Roboto', sans-serif;">
          ${page.outerHTML}
        </body>
      </html>
    `;
};
