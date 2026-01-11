import axios from 'axios';
import AuthService from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';
const ADMIN_NEWS_API_URL = `${API_BASE_URL}/api/admin/news`;
const UPLOAD_API_URL = `${API_BASE_URL}/api/upload`; // Assuming a general upload controller or specific one

class NewsService {
    getAuthHeader() {
        const token = AuthService.getToken();
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
        return {};
    }

    createNews(newsArticle) {
        const headers = {
            'Content-Type': 'application/json',
            ...this.getAuthHeader()
        };
        return axios.post(ADMIN_NEWS_API_URL, newsArticle, { headers });
    }

    updateNews(id, newsArticle) {
        const headers = {
            'Content-Type': 'application/json',
            ...this.getAuthHeader()
        };
        return axios.put(`${ADMIN_NEWS_API_URL}/${id}`, newsArticle, { headers });
    }

    getNewsById(id) {
        return axios.get(`${ADMIN_NEWS_API_URL}/${id}`, { headers: this.getAuthHeader() });
    }

    uploadNewsImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        const headers = { 
            'Content-Type': 'multipart/form-data',
            ...this.getAuthHeader()
        };
        // Adjust endpoint as needed, assuming a generic image upload or news specific one
        return axios.post(`${UPLOAD_API_URL}/image`, formData, { headers });
    }
}

export default new NewsService();
