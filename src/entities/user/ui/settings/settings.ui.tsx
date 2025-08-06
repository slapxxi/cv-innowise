import { Box, CardContent, Typography, useColorScheme } from '@mui/material';
import { Select, SelectItem } from '~/shared/ui/select.ui';
import { t } from 'i18next';
import type { ChangeEvent } from 'react';
import { useLanguageQuery } from '~/app';

export type ThemeMode = 'light' | 'dark' | 'system';

export const Settings = () => {
  const { mode, setMode } = useColorScheme();
  // const [theme, setTheme] = useTheme();
  const { language, setLanguage } = useLanguageQuery();

  const handleThemeChange = (
    event: ChangeEvent<HTMLInputElement> | (Event & { target: { value: unknown; name: string } })
  ) => {
    const newTheme = event.target.value as ThemeMode;
    setMode(newTheme);
    // setTheme(newTheme);
  };

  const handleLanguageChange = (
    event: ChangeEvent<HTMLInputElement> | (Event & { target: { value: unknown; name: string } })
  ) => {
    const newLanguage = event.target.value as 'en' | 'ru';
    setLanguage(newLanguage);
  };

  const themeOptions = [
    {
      value: 'light',
      label: t('theme.light'),
    },
    {
      value: 'dark',
      label: t('theme.dark'),
    },
    {
      value: 'system',
      label: t('theme.system'),
    },
  ];

  const languageOptions = [
    {
      value: 'en',
      label: t('English'),
    },
    {
      value: 'ru',
      label: t('Russian'),
    },
  ];
  const labelProps = {
    className: 'bg-bg dark:bg-bg-dark',
  };
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 6 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Select
            label={t('Appearance')}
            value={mode}
            onChange={handleThemeChange}
            className="w-full "
            labelProps={labelProps}
          >
            {themeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <Box>
                  <Typography variant="body1">{option.label}</Typography>
                </Box>
              </SelectItem>
            ))}
          </Select>
        </Box>
      </CardContent>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Select
            label={t('Language')}
            value={language}
            onChange={handleLanguageChange}
            className="w-full"
            labelProps={labelProps}
          >
            {languageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">{option.label}</Typography>
                </Box>
              </SelectItem>
            ))}
          </Select>
        </Box>
      </CardContent>
    </Box>
  );
};
