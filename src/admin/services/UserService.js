import axios from 'axios';
import AuthService from './AuthService';
import { API_BASE_URL } from '../../utils/config';

const API_URL = `${API_BASE_URL}/api/admin/auth`;

class UserService {
    getAuthHeader() {
        const token = AuthService.getToken();
        return { Authorization: `Bearer ${token}` };
    }

    getAllUsers(page = 0, size = 10, search = '', status = 'all', role = 'all') {
        const params = {
            page,
            size,
            search,
            status: status !== 'all' ? status : null,
            role: role !== 'all' ? role : null
        };
        
        // Remove null/undefined keys
        Object.keys(params).forEach(key => 
            (params[key] === null || params[key] === undefined || params[key] === '') && delete params[key]
        );

        return axios.get(API_URL, {
            headers: this.getAuthHeader(),
            params
        });
    }

    getUserById(id) {
        return axios.get(`${API_URL}/${id}`, { headers: this.getAuthHeader() });
    }

    updateUser(id, userData) {
        return axios.put(`${API_URL}/${id}`, userData, { headers: this.getAuthHeader() });
    }

    deleteUser(id) {
        return axios.delete(`${API_URL}/${id}`, { headers: this.getAuthHeader() });
    }

    updateUserStatus(id, status) {
        return axios.patch(`${API_URL}/${id}/status`, { status }, { headers: this.getAuthHeader() });
    }
}

export default new UserService();
