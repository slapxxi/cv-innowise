import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGE_STORAGE_KEY = 'app-language';

type Language = 'en' | 'ru';

const getLanguage = (): Language => {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return (storedLanguage as Language) || 'en';
};

const setLanguage = async (language: Language): Promise<Language> => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  return language;
};

export const useLanguageQuery = () => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();

  const { data: language = 'en' } = useQuery({
    queryKey: ['language'],
    queryFn: getLanguage,
    staleTime: Infinity,
  });

  useEffect(() => {
    const savedLanguage = getLanguage();
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const { mutate: setLanguageMutation } = useMutation({
    mutationFn: setLanguage,
    onSuccess: (newLanguage) => {
      i18n.changeLanguage(newLanguage);
      queryClient.invalidateQueries({ queryKey: ['language'] });
    },
  });

  return { language, setLanguage: setLanguageMutation };
};
