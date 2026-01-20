import axios from 'axios';
import AuthService from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';
const API_URL = `${API_BASE_URL}/api`;

const getAuthHeader = () => {
  const token = AuthService.getToken();
  return { Authorization: `Bearer ${token}` };
};

// Backend endpoints (to be implemented by backend developer):
// GET /api/comments?page=0&size=10&search=...
// DELETE /api/comments/:id

const CommentService = {
  getAllComments: async (page = 0, size = 10, search = '') => {
    const response = await axios.get(`${API_URL}/admin/auth/comments?page=${page}&size=${size}&search=${encodeURIComponent(search)}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  deleteComment: async (id) => {
    return axios.delete(`${API_URL}/admin/auth/comments/${id}`, {
      headers: getAuthHeader()
    });
  }
};

export default CommentService;
