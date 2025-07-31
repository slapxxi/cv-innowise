import { QueryClient } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import React, { type ReactElement } from 'react';
import { QueryClientProvider, ThemeProvider } from '~/app';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = new QueryClient();

  return (
    <ThemeProvider>
      <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
