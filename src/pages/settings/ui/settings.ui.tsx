import { Box, CardContent, Typography, useColorScheme } from '@mui/material';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageQuery } from '~/shared/hooks';
import { Select, SelectItem } from '~/shared/ui';

export type ThemeMode = 'light' | 'dark' | 'system';

const themeOptions = [
  {
    value: 'light',
    label: 'theme.light',
  },
  {
    value: 'dark',
    label: 'theme.dark',
  },
  {
    value: 'system',
    label: 'theme.system',
  },
];

const languageOptions = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'ru',
    label: 'Russian',
  },
];

const labelProps = {
  className: 'bg-bg dark:bg-bg-dark',
};

export const Settings = () => {
  const { mode, setMode } = useColorScheme();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageQuery();

  const handleThemeChange = (
    event: ChangeEvent<HTMLInputElement> | (Event & { target: { value: unknown; name: string } })
  ) => {
    const newTheme = event.target.value as ThemeMode;
    setMode(newTheme);
  };

  const handleLanguageChange = (
    event: ChangeEvent<HTMLInputElement> | (Event & { target: { value: unknown; name: string } })
  ) => {
    const newLanguage = event.target.value as 'en' | 'ru';
    setLanguage(newLanguage);
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
                  <Typography variant="body1">{t(option.label)}</Typography>
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
                  <Typography variant="body1">{t(option.label)}</Typography>
                </Box>
              </SelectItem>
            ))}
          </Select>
        </Box>
      </CardContent>
    </Box>
  );
};
