import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      Cancel: 'Cancel',
      CVs: 'CVs',
      Department: 'Department',
      Email: 'Email',
      'Email is required': 'Email is required',
      Employees: 'Employees',
      'First Name': 'First Name',
      'Forgot password': 'Forgot password',
      'Happy to see you': 'Hello again! Log in to continue',
      'I have an account': 'I have an account',
      Language: 'Language',
      Languages: 'Languages',
      'Last Name': 'Last Name',
      Login: 'Log In',
      'Login tab': 'Log In',
      'Password is required': 'Password is required',
      Password: 'Password',
      Position: 'Position',
      Profile: 'Profile',
      Register: 'Register now',
      'Reset password': 'Reset password',
      Signup: 'Create Account',
      'Signup tab': 'Sign Up',
      Skills: 'Skills',
      'Welcome back': 'Welcome back',
      'Welcome to React': 'Welcome to React and react-i18next',
      Welcome: 'Welcome! Sign up to continue',
      'We will send you an email with further instructions': 'We will send you an email with further instructions',
      'Add skill': 'Add Skill',
      'Remove skill': 'Remove Skill',
      'Add skills': 'Add Skills',
      'Remove skills': 'Remove Skills',
      Delete: 'Delete',
      'Language proficiency': 'Language Proficiency',
      'Add language': 'Add Language',
      'Remove language': 'Remove Language',
      'Add languages': 'Add Languages',
      'Remove languages': 'Remove Languages',
      'Not specified': 'Not Specified',
    },
  },
  ru: {
    translation: {
      Cancel: 'Отменить',
      CVs: 'Резюме',
      Department: 'Отдел',
      'Email is required': 'Электронная почта обязательна',
      Email: 'Электронная почта',
      Employees: 'Сотрудники',
      'First Name': 'Имя',
      'Forgot password': 'Забыли пароль',
      'Happy to see you': 'Рады вас видеть! Войдите, чтобы продолжить',
      'I have an account': 'У меня есть аккаунт',
      Languages: 'Языки',
      Language: 'Язык',
      'Last Name': 'Фамилия',
      'Login tab': 'Войти',
      Login: 'Войти',
      'Password is required': 'Пароль обязателен',
      Password: 'Пароль',
      Position: 'Должность',
      Profile: 'Профиль',
      Register: 'Зарегистрируйтесь',
      'Reset password': 'Сбросить пароль',
      'Signup tab': 'Зарегистрироваться',
      Signup: 'Создать аккаунт',
      Skills: 'Навыки',
      'Welcome back': 'С возвращением',
      'Welcome to React': 'Добро пожаловать в React и react-i18next',
      Welcome: 'Добро пожаловать! Создайте аккаунт, чтобы продолжить',
      'We will send you an email with further instructions':
        'Мы отправим вам электронное письмо с дальнейшими инструкциями',
      'Add Skill': 'Добавить навык',
      'Add Skills': 'Добавить навыки',
      'Remove Skill': 'Удалить навык',
      'Remove Skills': 'Удалить навыки',
      Delete: 'Удалить',
      Databases: 'Базы данных',
      'Backend technologies': 'Технологии бэкенда',
      'Frontend technologies': 'Технологии фронтенда',
      'Programming languages': 'Языки программирования',
      'Source control systems': 'Контроль версий',
      'State management libraries': 'Библиотеки управления состоянием',
      Confirm: 'Подтвердить',
      Novice: 'Новичок',
      Advanced: 'Продвинутый',
      Competent: 'Компетент',
      Proficient: 'Профессионал',
      Expert: 'Эксперт',
      Category: 'Категория',
      Russian: 'Русский',
      English: 'Английский',
      Portugal: 'Португальский',
      Italian: 'Итальянский',
      German: 'Немецкий',
      Belarussian: 'Белорусский',
      Belarusian: 'Белорусский',
      Polish: 'Польский',
      'Mastery Level': 'Уровень мастерства',
      'Language proficiency': 'Уровень владения языком',
      'Add language': 'Добавить язык',
      'Remove languages': 'Удалить языки',
      'Not specified': 'Не указано',
      // etc...
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
