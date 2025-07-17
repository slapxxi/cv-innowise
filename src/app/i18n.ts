import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      Email: 'Email',
      'Forgot password': 'Forgot password',
      'Happy to see you': 'Hello again! Log in to continue',
      'I have an account': 'I have an account',
      Language: 'Language',
      Login: 'Log In',
      Password: 'Password',
      Signup: 'Create account',
      'Welcome back': 'Welcome back',
      'Welcome to React': 'Welcome to React and react-i18next',
      Register: 'Register now',
      Welcome: 'Welcome! Sign up to continue',
    },
  },
  ru: {
    translation: {
      Email: 'Электронная почта',
      'Forgot password': 'Забыли пароль',
      'Happy to see you': 'Рады вас видеть! Войдите, чтобы продолжить',
      'I have an account': 'У меня есть аккаунт',
      Language: 'Язык',
      Login: 'Войти',
      Password: 'Пароль',
      Signup: 'Создать аккаунт',
      'Welcome back': 'С возвращением',
      'Welcome to React': 'Добро пожаловать в React и react-i18next',
      Register: 'Зарегистрируйтесь',
      Welcome: 'Добро пожаловать! Создайте аккаунт, чтобы продолжить',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export { i18n };

export default i18n;
