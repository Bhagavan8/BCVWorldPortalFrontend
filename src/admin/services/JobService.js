import axios from 'axios';
import AuthService from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';
const API_URL = `${API_BASE_URL}/api/jobs`;
const ADMIN_API_URL = `${API_BASE_URL}/api/admin/jobs`;
const COMPANY_API = `${API_BASE_URL}/api/companies`;

class JobService {
    getAuthHeader() {
        const token = AuthService.getToken();
        if (token) {
            console.log('JobService: Attaching auth token:', token.substring(0, 10) + '...');
            return { Authorization: `Bearer ${token}` };
        }
        console.warn('JobService: No token found via AuthService');
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
        
        // Get headers from helper but ensure Content-Type is NOT set for FormData
        const authHeaders = this.getAuthHeader();
        const headers = {
            ...authHeaders
            // Content-Type is left undefined to let the browser set it with the boundary
        };
        
        // Switching to the company endpoint as requested by the user
        const uploadUrl = `${COMPANY_API}/upload-logo`;

        console.log('Uploading logo to:', uploadUrl);
        return axios.post(uploadUrl, formData, { headers });
    }

    searchCompanies(q) {
        return axios.get(`${COMPANY_API}/search`, { 
            params: { q },
            headers: this.getAuthHeader()
        });
    }
}

export default new JobService();