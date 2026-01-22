import axios from 'axios';
import AuthService from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';
const NOTIFICATION_API_URL = `${API_BASE_URL}/api/admin/notifications`;

class NotificationService {
    getAuthHeader() {
        const token = AuthService.getToken();
        if (token) {
            return { Authorization: `Bearer ${token}` };
        }
        return {};
    }

    async getRecentNotifications() {
        try {
            const config = {
                headers: this.getAuthHeader()
            };
            const response = await axios.get(`${NOTIFICATION_API_URL}/recent`, config);
            return response.data;
        } catch (error) {
            console.error('Error fetching recent notifications:', error);
            return [];
        }
    }
}

export default new NotificationService();
