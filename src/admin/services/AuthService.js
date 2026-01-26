import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';

const API_URL = `${API_BASE_URL}/api/admin/auth`;

class AuthService {
    constructor() {
        this.observers = [];
    }

    subscribe(callback) {
        this.observers.push(callback);
    }

    unsubscribe(callback) {
        this.observers = this.observers.filter(cb => cb !== callback);
    }

    notify(user) {
        this.observers.forEach(cb => cb(user));
    }

    login(credentials) {
        return axios.post(`${API_URL}/login`, credentials);
    }

    register(user) {
        return axios.post(`${API_URL}/register`, user);
    }

    socialLogin(provider, data) {
        return axios.post(`${API_URL}/social`, { provider, ...data });
    }

    logout() {
        localStorage.removeItem('user');
        this.notify(null);
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    getRole() {
        const user = this.getCurrentUser();
        if (!user) return null;
        // Check for role in various nested structures
        if (user.role) return user.role;
        if (user.user && user.user.role) return user.user.role;
        if (user.data && user.data.role) return user.data.role;
        // Fallback or default
        return null;
    }

    getToken() {
        const user = this.getCurrentUser();
        if (!user) return null;
        
        let token = user.token;
        if (!token && user.data?.token) token = user.data.token;
        if (!token && user.user?.token) token = user.user.token;
        if (!token && user.access_token) token = user.access_token;

        if (token && token.startsWith('Bearer ')) {
            token = token.replace('Bearer ', '');
        }
        return token;
    }

    isAdmin() {
        const role = this.getRole();
        return role === 'ADMIN' || role === 'admin';
    }

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.notify(user);
    }
}

export default new AuthService();
