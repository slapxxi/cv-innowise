import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

export const theme = createTheme({ cssVariables: true });

export const ThemeProvider = (props: { children: React.ReactNode }) => {
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
};
