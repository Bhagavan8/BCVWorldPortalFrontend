import axios from 'axios';
import AuthService from '../admin/services/AuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';

const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      console.log('Attaching Authorization header. Token starts with:', token.substring(0, 10));
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found via AuthService');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || '';

    if (status === 401 || status === 403) {
      const isFinanceRequest = requestUrl.includes('/finance/');

      if (isFinanceRequest) {
        console.warn(
          'Admin API auth error on finance endpoint. Keeping session, showing page-level error instead.',
          status,
          requestUrl
        );
        return Promise.reject(error);
      }

      console.warn('Admin API auth error detected, logging out and redirecting', status, requestUrl);
      AuthService.logout();
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/auth';
      } else {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;
