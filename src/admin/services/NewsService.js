import axios from 'axios';
import AuthService from './AuthService';
import { API_BASE_URL } from '../../utils/config';

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

    async uploadNewsImage(file) {
        if (typeof window !== 'undefined' && typeof FileReader !== 'undefined' && file) {
            try {
                const dataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error('FileReader error'));
                    reader.readAsDataURL(file);
                });
                return { data: { url: dataUrl } };
            } catch (_) { /* no-op, will fallback */ }
        }

        const formData = new FormData();
        formData.append('file', file);
        const headers = { ...this.getAuthHeader() };

        const endpoints = [
            `${API_BASE_URL}/api/admin/upload/image`,
            `${UPLOAD_API_URL}/image`,
            `${API_BASE_URL}/api/admin/news/image`,
            `${API_BASE_URL}/api/admin/news/upload-image`,
            `${API_BASE_URL}/api/news/upload-image`
        ];
        
        let lastError;
        for (const url of endpoints) {
            try {
                const res = await axios.post(url, formData, { headers });
                return res;
            } catch (err) {
                lastError = err;
            }
        }
        throw lastError || new Error('Image upload failed');
    }
}

export default new NewsService();
