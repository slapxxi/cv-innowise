import GlobalStyles from '@mui/material/GlobalStyles';
import { StyledEngineProvider } from '@mui/material/styles';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Import the generated route tree
import { QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider, ThemeProvider, useAuth } from '~/app';
import '~/app/i18n';
import '~/app/styles/styles.css';
import { queryClient } from '~/shared';
import reportWebVitals from './reportWebVitals.ts';
import { routeTree } from './routeTree.gen';

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: { accessToken: null, user: null, isAuthenticated: () => !!queryClient.getQueryData(['auth']) },
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <ThemeProvider>
          <LocalizationProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StrictMode>
  );
}

function App() {
  const auth = useAuth();

  useEffect(() => {
    router.invalidate();
  }, [auth.isAuthenticated()]);

  if (auth.isLoading) {
    return null;
  }

  return (
    <RouterProvider
      router={router}
      context={{ auth: { accessToken: auth.accessToken, user: auth.user, isAuthenticated: auth.isAuthenticated } }}
    />
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
