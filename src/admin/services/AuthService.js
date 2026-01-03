import axios from 'axios';

const API_URL = '/api/admin/auth';

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

    isAdmin() {
        const user = this.getCurrentUser();
        return user && (user.role === 'ADMIN' || user.role === 'admin');
    }

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.notify(user);
    }
}

export default new AuthService();
