import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Home, User, LogOut, Plus, Settings } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* head */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* logo */}
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">80 Страниц</span>
            </Link>

            {/* nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Главная</span>
              </Link>
              
              <Link
                to="/pages"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/pages') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Страницы</span>
              </Link>

              {isAuthenticated && (
                <Link
                  to="/add"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/add') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>Добавить</span>
                </Link>
              )}

              {isAdmin() && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Админ</span>
                </Link>
              )}
            </nav>

            {/* menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Выйти</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Регистрация
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

      {/* foot */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 <a href='https://github.com/bogdanbeyn' className='text-primary-600'>Bogdan Beyn</a> - Все права защищены.</p>
            <p className="mt-2 text-sm underline">
              <a href='https://github.com/bogdanbeyn/eightypages'>Проект распространяется с открытым исходным кодом.</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
