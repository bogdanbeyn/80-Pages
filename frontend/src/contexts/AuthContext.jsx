import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { useLanguage } from './LanguageContext';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const {t, language} = useLanguage();
  const [state, dispatch] = useReducer(authReducer, initialState);

  // проверка токена
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: userData, token },
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'AUTH_FAILURE', payload: 'Invalid token' });
      }
    } else {
      dispatch({ type: 'AUTH_FAILURE', payload: null });
    }
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
    const rawMessage = error.response?.data?.message;
    let translatedMessage;

    switch (rawMessage) {
      case 'User not found':
        translatedMessage = t('userNotFound');
        break;
      case 'Wrong password':
        translatedMessage = t('wrongPassword');
        break;
      default:
        translatedMessage = t['login failed'] || 'Login failed';
      }
      dispatch({ type: 'AUTH_FAILURE', payload: translatedMessage });
      return { success: false, error: translatedMessage };
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const isAdmin = useCallback(() => {
    return state.user?.role === 'ADMIN';
  }, [state.user?.role]);

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
