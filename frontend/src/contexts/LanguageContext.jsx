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
    moder: 'Модератор',
    login: 'Войти',
    register: 'Регистрация',
    logout: 'Выйти',
    confirmPageDelete: 'Вы уверены, что хотите удалить эту страницу?',
    confirmCommentDelete: 'Вы уверены, что хотите удалить этот комментарий?',
    confirmUserDelete: 'Вы уверены, что хотите удалить этого пользователя?',
    confirmUserDisabling: 'Вы уверены, что хотите отключить этого пользователя?',
    deleteWarning: 'После нажатия на "Удалить", вы не сможете восстановить элемент!',
    disableWarning: 'Пользователь не сможет войти в систему и оставлять комментарии',
    
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
    search: 'Поиск',
    gpw: 'Великая Отечественная Война',
    userNotFound: 'Пользователь не найден',
    wrongPassword: 'Неправильный пароль',
    title: 'Название',
    category: 'Категория',
    image: 'Изображение',
    file: 'Файл',
    content: 'Контент',
    contentTip: 'Введите текст страницы',
    
    // Pages
    pageTitle: '80 страниц истории Победы',
    pageSubtitle: 'Изучайте историю Великой Победы',
    noPages: 'Страницы не найдены',
    noPagesDesc: 'Попробуйте изменить параметры поиска или фильтры',
    pageNotFound: 'Страница не найдена',
    noPagesDescAdm: 'Страницы будут отображаться здесь после создания',
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
    noCommentsFnd: 'Комментарии не найдены',
    noCommentsDescAdm: 'Комментарии будут отображаться здесь',
    pagesTitle: 'Исторические страницы',
    pagesDescription: 'Исследуйте 80 важных страниц истории победы. Каждая страница рассказывает уникальную историю о событиях, людях и местах, которые сформировали нашу страну.',
    pagesSearch: 'Поиск по названию или содержанию...',
    commentsSearch: 'Поиск по автору или содержанию...',
    pagesFilterByCategory: 'Все категории',
    commentsFilterByPage: 'Все страницы',
    pagesFound: 'Найдено страниц',
    readMore: 'Читать далее',
    views: 'Просмотры',
    users: 'Пользователи',
    accountDisabled: 'Ваш аккаунт отключен. Если вы считаете, что произошла ошибка, обратитесь в поддержку.',

    // Tests
    tests: 'Тесты',
    question: 'Вопрос',
    testsTitle: 'Проверь себя',
    testsDescription: 'Здесь собраны все тесты посвященные истории Великой Победы',
    submitAnswer: 'Отправить',
    backToTests: 'Вернуться к Тестам',
    yourResult: 'Ваш результат',
    thanksForTest: 'Спасибо за прохождение теста',
    redirectMessage: 'Вы будете автоматически еренаправлены через 10 секунд',

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
    managePagesAndComments: 'Управление страницами и комментариями',
    manageComments: 'Управление комментариями',
    editPageTitle: 'Редактирование страницы'
  },
  en: {
    // Navigation
    home: 'Home',
    pages: 'Pages',
    admin: 'Admin',
    moder: 'Moderator',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    confirmPageDelete: 'Do you really want to delete this page?',
    confirmCommentDelete: 'Do you really want to delete this comment?',
    confirmUserDelete: 'Do you really want to delete this user?',
    confirmUserDisabling: 'Do you really want to disable this user?',
    deleteWarning: 'You woudn\'t restore it after the deleting.',
    disableWarning: 'The user cannot log in and leave comments',
    
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
    search: 'Search',
    gpw: 'Great Patriotic War',
    userNotFound: 'User not found',
    wrongPassword: 'Wrong password',
    title: 'Title',
    category: 'Category',
    image: 'Image',
    file: 'File',
    content: 'Content',
    contentTip: 'Enter the text of page',

    // Pages
    pageTitle: '80 pages of Victory history',
    pageSubtitle: 'Learn the history of the Great Victory',
    noPages: 'No pages found',
    noPagesDesc: 'Try changing the search terms or filters',
    pageNotFound: 'Page not found',
    noPagesDescAdm: 'There is you will see the pages',
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
    noCommentsFnd: 'No comments found',
    noCommentsDescAdm: 'There is you will see the comments',
    pagesTitle: 'Historical Pages',
    pagesDescription: 'Explore 80 significant pages of victory history. Each page tells a unique story about events, people, and places that shaped our country.',
    pagesSearch: 'Search by title or content...',
    commentsSearch: 'Search by author or content...',
    pagesFilterByCategory: 'All categories',
    commentsFilterByPage: 'All pages',
    pagesFound: 'Pages found',
    readMore: 'Read more',
    views: 'Views',
    users: 'Users',
    accountDisabled: 'Your account is disabled. If you believe an error has occurred, please contact support.',

    // Tests
    tests: 'Tests',
    question: 'Question',
    testsTitle: 'Test yourself',
    testsDescription: 'Here are collected all the tests dedicated to the history of the Great Victory',
    submitAnswer: 'Sumbit',
    backToTests: 'Back to Tests',
    yourResult: 'Your result',
    thanksForTest: 'Thanks for taking the test',
    redirectMessage: 'You will be automatically redirected back in 10 seconds',
    
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
    managePagesAndComments: 'Manage pages and comments',
    manageComments: 'Manage comments',
    editPageTitle: 'Page editing'
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
