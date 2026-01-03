import axios from 'axios';

const api = axios.create({
  baseURL: '/api/admin/auth',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // 👈 IMPORTANT
});

export default api;
