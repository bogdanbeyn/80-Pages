import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Home, User, LogOut, Settings, Sun, Moon, Globe, BadgeQuestionMarkIcon } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout, isAdmin, isModer } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const location = useLocation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900 dark:to-orange-900 transition-colors">
      {/* header */}
     <header className="relative z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-b-2 border-red-200 dark:border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-white text-xl font-bold">80</span>
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">⭐</span>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  {t('pageTitle')}
                </span>

              </div>
            </Link>

            {/* navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-800/50 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>{t('home')}</span>
              </Link>
              
              <Link
                to="/pages"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/pages') 
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-800/50 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>{t('pages')}</span>
              </Link>
              
              <Link
                to="/tests"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/tests') 
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-800/50 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <BadgeQuestionMarkIcon className="h-4 w-4" />
                <span>{t('tests')}</span>
              </Link>

              {isModer() && (
                <Link
                  to="/moder"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/moder') 
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-800/50 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>{t('moder')}</span>
                </Link>
              )}

              {isAdmin() && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/admin') 
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 shadow-md' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-800/50 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>{t('admin')}</span>
                </Link>
              )}
            </nav>

            {/* controls */}
            <div className="flex items-center space-x-3">
              {/* theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={theme === 'light' ? t('darkTheme') : t('lightTheme')}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-500" />
                )}
              </button>

              {/* language toggle */}
              <div className="language-switcher relative" ref={languageMenuRef}>
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="z-50 flex items-center space-x-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title={t('language')}
                >
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                    {language}
                  </span>
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-fade-in">
                    <button
                      onClick={() => {
                        changeLanguage('ru');
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        language === 'ru' ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {t('russian')}
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('en');
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        language === 'en' ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {t('english')}
                    </button>
                  </div>
                )}
              </div>

              {/* user menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">{t('logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium "
                  >
                    {t('register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* footer */}
      <footer className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t-2 border-red-200 dark:border-red-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  {t('pageTitle')}
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">
                  {t('pageSubtitle')}
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              &copy; 2025 <a href='https://github.com/bogdanbeyn' className='text-red-600 dark:text-red-400 hover:underline'>Bogdan Beyn</a>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              <a href='https://github.com/bogdanbeyn/80-Pages' className='hover:underline'>
                {t('openSource')}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
