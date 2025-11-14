import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
// Settings и BadgeQuestionMarkIcon можно использовать для Admin/Moder
import { BookOpen, Home, User, LogOut, Settings, Sun, Moon, Globe, BadgeQuestionMarkIcon, Menu, X, Shield, Wrench, ShieldIcon, WrenchIcon } from 'lucide-react'; // Добавил Shield и Wrench для Admin/Moder

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout, isAdmin, isModer } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const location = useLocation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const languageMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Вспомогательный компонент для компактных кнопок
  const ControlButton = ({ to, icon: Icon, labelKey, titleKey }) => (
    <Link
      to={to}
      className={`p-2 rounded-lg transition-colors ${
        isActive(to) 
          ? 'bg-red-200 dark:bg-red-700 text-red-700 dark:text-red-300 shadow-inner' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-800/50 hover:text-red-600 dark:hover:text-red-400'
      }`}
      title={t(titleKey)}
    >
      <Icon className="h-5 w-5" />
      <span className="sr-only">{t(labelKey)}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900 dark:to-orange-900 transition-colors">
      <header className="relative z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-b-2 border-red-200 dark:border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* logo */}
            <Link to="/" className="flex items-center space-x-1 group">
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-white text-2xl font-bold">80</span>
                </div>
              </div>
              {/* Текст логотипа скрывается на экранах меньше 'md' */}
              <div className="">
                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  {language === 'ru' ? 'страниц' : 'pages'}
                </span>
              </div>
            </Link>

            {/* navigation - СКРЫТА НА ТЕЛЕФОНЕ (lg:flex) */}
            <nav className="hidden lg:flex items-center space-x-6">
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
            </nav>

            {/* controls and auth buttons */}
            <div className="flex items-center space-x-3">
              
              {isModer() && (
                <button
                onClick={() => navigate('/moder')}
                className="hidden lg:block p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title='Панель модератора'
              >
                <WrenchIcon className='h-5 w-5 text-gray-600 dark:text-gray-300'/>
              </button>
              )}
              
              {isAdmin() && (
                <button
                onClick={() => navigate('/admin')}
                className="hidden lg:block p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title='Панель администратора'
              >
                <ShieldIcon className='h-5 w-5 text-gray-600 dark:text-gray-300'/>
              </button>
              )}
              
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
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase hidden sm:inline">
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

              {/* user menu & auth buttons - СКРЫТЫ НА ТЕЛЕФОНЕ (md:flex) */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-3">
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
                <div className="hidden md:flex items-center space-x-3">
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
              
              {/* Mobile menu button - ПОЯВЛЯЕТСЯ НА ТЕЛЕФОНЕ (md:hidden) */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu content - Появляется при isMenuOpen=true */}
        <div 
          ref={mobileMenuRef}
          className={`lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-[80vh] overflow-y-auto border-t border-red-200 dark:border-red-800' : 'max-h-0'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Mobile Navigation Links */}
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-700 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                  <Home className="h-5 w-5"/><span>{t('home')}</span>
              </div>
            </Link>
            <Link
              to="/pages"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/pages') 
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-700 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5"/><span>{t('pages')}</span>
              </div>
            </Link>
            <Link
              to="/tests"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/tests') 
                  ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-700 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                  <BadgeQuestionMarkIcon className="h-5 w-5"/><span>{t('tests')}</span>
              </div>
            </Link>

            {/* Mobile Moder/Admin Links - ПОЯВЛЯЮТСЯ В МОБИЛЬНОМ МЕНЮ */}
            {isModer() && (
              <Link
                to="/moder"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/moder') 
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-700 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                    <Wrench className="h-5 w-5"/><span>{t('moder')}</span>
                </div>
              </Link>
            )}

            {isAdmin() && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/admin') 
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-700 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5"/><span>{t('admin')}</span>
                </div>
              </Link>
            )}

            {/* Mobile Auth/User Menu */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">
                      {user?.name}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="mt-3 block w-full text-left px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-700 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <div className="flex items-center space-x-3">
                        <LogOut className="h-5 w-5"/><span>{t('logout')}</span>
                    </div>
                  </button>
                </>
              ) : (
                <div className="space-y-2 px-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-700 rounded-lg transition-colors"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium block w-full text-center"
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

      {/* footer (не менялся) */}
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