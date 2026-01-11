import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/admin/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // 👈 IMPORTANT
});

export default api;
