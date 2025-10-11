import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  ru: {
    // Navigation
    home: 'Главная',
    pages: 'Страницы',
    admin: 'Админ',
    login: 'Войти',
    register: 'Регистрация',
    logout: 'Выйти',
    
    // Common
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    edit: 'Редактировать',
    back: 'Назад',
    next: 'Далее',
    previous: 'Назад',
    
    // Pages
    pageTitle: '80 Страниц Победы',
    pageSubtitle: 'Изучайте историю Великой Отечественной Войны',
    noPages: 'Страницы не найдены',
    pageNotFound: 'Страница не найдена',
    backToList: 'Вернуться к списку',
    author: 'Автор',
    published: 'Опубликовано',
    comments: 'Комментарии',
    comment: 'Комментарий',
    reply: 'Ответить',
    send: 'Отправить',
    sending: 'Отправка...',
    writeComment: 'Напишите комментарий...',
    writeReply: 'Напишите ответ...',
    noComments: 'Пока нет комментариев. Будьте первым!',
    
    // Categories
    city: 'Город',
    hero: 'Герой',
    event: 'Событие',
    letter: 'Письмо',
    monument: 'Памятник',
    artifact: 'Артефакт',
    
    // Auth
    email: 'Email',
    password: 'Пароль',
    name: 'Имя',
    confirmPassword: 'Подтвердите пароль',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    dontHaveAccount: 'Нет аккаунта?',
    
    // Footer
    openSource: 'Проект распространяется с открытым исходным кодом.',
    
    // Theme
    lightTheme: 'Светлая тема',
    darkTheme: 'Темная тема',
    
    // Language
    language: 'Язык',
    russian: 'Русский',
    english: 'English',
    characters: 'символов',
    
    // Admin
    panel: 'Панель',
    managePagesAndComments: 'Управление страницами и комментариями'
  },
  en: {
    // Navigation
    home: 'Home',
    pages: 'Pages',
    admin: 'Admin',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    
    // Pages
    pageTitle: '80 Pages of Victory',
    pageSubtitle: 'Learn the history of the Great Patriotic War',
    noPages: 'No pages found',
    pageNotFound: 'Page not found',
    backToList: 'Back to list',
    author: 'Author',
    published: 'Published',
    comments: 'Comments',
    comment: 'Comment',
    reply: 'Reply',
    send: 'Send',
    sending: 'Sending...',
    writeComment: 'Write a comment...',
    writeReply: 'Write a reply...',
    noComments: 'No comments yet. Be the first!',
    
    // Categories
    city: 'City',
    hero: 'Hero',
    event: 'Event',
    letter: 'Letter',
    monument: 'Monument',
    artifact: 'Artifact',
    
    // Auth
    email: 'Email',
    password: 'Password',
    name: 'Name',
    confirmPassword: 'Confirm Password',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    
    // Footer
    openSource: 'This project is distributed with open source code.',
    
    // Theme
    lightTheme: 'Light theme',
    darkTheme: 'Dark theme',
    
    // Language
    language: 'Language',
    russian: 'Русский',
    english: 'English',
    characters: 'characters',
    
    // Admin
    panel: 'Panel',
    managePagesAndComments: 'Manage pages and comments'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
