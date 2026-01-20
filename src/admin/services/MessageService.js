import axios from 'axios';
import AuthService from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';
const API_URL = `${API_BASE_URL}/api`;

const getAuthHeader = () => {
  const token = AuthService.getToken();
  return { Authorization: `Bearer ${token}` };
};

// Backend endpoints (to be implemented by backend developer):
// GET /api/contact-messages
// GET /api/suggestions

const MessageService = {
  getMessages: async (page = 0, size = 10) => {
    const response = await axios.get(`${API_URL}/admin/auth/contact-messages?page=${page}&size=${size}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getSuggestions: async (page = 0, size = 10) => {
    const response = await axios.get(`${API_URL}/admin/auth/suggestions?page=${page}&size=${size}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

export default MessageService;
