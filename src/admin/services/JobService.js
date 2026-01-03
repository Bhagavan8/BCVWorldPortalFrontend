import axios from 'axios';
import AuthService from './AuthService';

const API_URL = '/api/jobs';
const ADMIN_API_URL = '/api/admin/jobs';
const COMPANY_API = '/api/companies';

class JobService {
    getAuthHeader() {
        const user = AuthService.getCurrentUser();
        // Check for nested token structures (e.g. user.data.token, user.token)
        let token = user?.token;
        if (!token && user?.data?.token) token = user.data.token;
        if (!token && user?.user?.token) token = user.user.token;
        if (!token && user?.access_token) token = user.access_token;

        if (token) {
            // Remove 'Bearer ' prefix if it's already in the token string to avoid double prefixing
            if (token.startsWith('Bearer ')) {
                token = token.replace('Bearer ', '');
            }
            console.log('JobService: Attaching auth token:', token.substring(0, 10) + '...');
            return { Authorization: `Bearer ${token}` };
        }
        console.warn('JobService: No token found in user object:', user);
        return {};
    }

    createJob(job) {
        const headers = {
            'Content-Type': 'application/json',
            ...this.getAuthHeader()
        };
        // Use the dedicated admin endpoint for creating jobs
        console.log('JobService: Creating job at', ADMIN_API_URL, 'with headers:', headers);
        return axios.post(ADMIN_API_URL, job, { headers });
    }

    updateJob(id, job) {
        const headers = {
            'Content-Type': 'application/json',
            ...this.getAuthHeader()
        };
        console.log(`JobService: Updating job ${id} at`, `${ADMIN_API_URL}/${id}`, 'with headers:', headers);
        return axios.put(`${ADMIN_API_URL}/${id}`, job, { headers });
    }

    getAllJobs() {
        return axios.get(API_URL, { headers: this.getAuthHeader() });
    }

    getJobById(id) {
        return axios.get(`${API_URL}/${id}`, { headers: this.getAuthHeader() });
    }

    uploadCompanyLogo(file) {
        const formData = new FormData();
        formData.append('file', file);
        const headers = { 
            'Content-Type': 'multipart/form-data',
            ...this.getAuthHeader()
        };
        return axios.post(`${COMPANY_API}/upload-logo`, formData, { headers });
    }

    searchCompanies(q) {
        return axios.get(`${COMPANY_API}/search`, { 
            params: { q },
            headers: this.getAuthHeader()
        });
    }
}

export default new JobService();