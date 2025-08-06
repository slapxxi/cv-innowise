import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import React from 'react';
import { CssBaseline } from '@mui/material';

export const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'data-theme',
  },
});
export const ThemeProvider = (props: { children: React.ReactNode }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </MuiThemeProvider>
  );
};
