import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// axios w/ basic config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptor for responses processing
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token is expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// api methods for auth
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// api methods for pages
export const pagesAPI = {
  getPages: (params = {}) => api.get('/pages', { params }),
  getPage: (id) => api.get(`/pages/${id}`),
  getPagesByComments: () => api.get('/pages/by-comments'),
  createPage: (pageData) => api.post('/pages', pageData),
  updatePage: (id, pageData) => api.put(`/pages/${id}`, pageData),
  deletePage: (id) => api.delete(`/pages/${id}`),
};

// api methods for categories
export const categoriesAPI = {
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
};

// api methods for comments
export const commentsAPI = {
  getComments: (pageId) => api.get(`/comments/page/${pageId}`),
  getAllComments: (params = {}) => api.get('/comments/all', { params }),
  createComment: (commentData) => api.post('/comments', commentData),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

// api methods for usres
export const usersAPI = {
  getAllUsers: () => api.get('/users/all'),
  deleteUser: (userId) => api.post(`/users/${userId}`),
  deleteUserPerm: (userId) => api.delete(`/users/${userId}`),
};

// api methods for file uploading
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteImage: (filename) => api.delete(`/upload/${filename}`),
};

export default api;
