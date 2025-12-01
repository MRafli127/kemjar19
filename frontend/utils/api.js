import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token');
      Cookies.remove('user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  loginAnonymous: () => api.post('/auth/anonymous'),
  verify: () => api.get('/auth/verify'),
};

// FTP API
export const ftpAPI = {
  uploadFile: (formData) => {
    return api.post('/ftp/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getFiles: () => api.get('/ftp/files'),
  downloadFile: (filename) => {
    return api.get(`/ftp/download/${filename}`, {
      responseType: 'blob',
    });
  },
  deleteFile: (filename) => api.delete(`/ftp/files/${filename}`),
  testConnection: () => api.get('/ftp/test-connection'),
};

export default api;
