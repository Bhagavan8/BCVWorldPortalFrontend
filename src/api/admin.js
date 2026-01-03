import axios from 'axios';
import AuthService from '../admin/services/AuthService';

const adminApi = axios.create({
  baseURL: '/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
      console.log('Attaching Authorization header. Token starts with:', user.token.substring(0, 10));
      config.headers.Authorization = `Bearer ${user.token}`;
    } else {
      console.warn('No token found in user object:', user);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default adminApi;
