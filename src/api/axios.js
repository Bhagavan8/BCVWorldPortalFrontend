import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/admin/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // 👈 IMPORTANT
});

// Add retry interceptor for robust network handling
api.interceptors.response.use(
  response => response,
  async (error) => {
    const config = error.config;
    
    // Default retry count to 3 if not specified, but only for GET requests or if explicitly enabled
    // We avoid retrying POST/PUT/DELETE by default to prevent duplicate operations unless idempotent
    const shouldRetry = config && (config.retry || (config.method === 'get' && config.retry !== false));
    
    if (!shouldRetry) {
      return Promise.reject(error);
    }
    
    // Initialize retry count
    config.__retryCount = config.__retryCount || 0;
    const maxRetries = config.retryCount || 3;
    
    // Check if we've maxed out
    if (config.__retryCount >= maxRetries) {
      return Promise.reject(error);
    }
    
    // Check if error is retryable (Network Error or 5xx)
    // Don't retry client errors (4xx) except 408/429
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
        if (error.response.status !== 408 && error.response.status !== 429) {
            return Promise.reject(error);
        }
    }
    
    config.__retryCount += 1;
    
    // Exponential backoff
    const delay = 1000 * Math.pow(2, config.__retryCount - 1);
    console.log(`Network error, retrying request... attempt ${config.__retryCount} in ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return api(config);
  }
);

export default api;
