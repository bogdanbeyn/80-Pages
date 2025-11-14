import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, moderOnly = false }) => {
  const { isAuthenticated, isAdmin, isModer, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Доступ запрещен
          </h1>
          <p className="text-gray-600 mb-6">
            У вас нет прав для доступа к этой странице. Требуются права администратора.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }


  if (moderOnly && !isModer() | adminOnly && !isAdmin()) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Доступ запрещен
          </h1>
          <p className="text-gray-600 mb-6">
            У вас нет прав для доступа к этой странице. Требуются права модератора.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }


  return children;
};

export default ProtectedRoute;
