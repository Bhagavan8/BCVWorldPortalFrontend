import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Add retry interceptor for robust network handling
api.interceptors.response.use(
  response => response,
  async (error) => {
    const config = error.config;
    
    // Default retry count to 3 if not specified
    const shouldRetry = config && (config.retry || (config.method === 'get' && config.retry !== false));
    
    if (!shouldRetry && config.method !== 'post') { // Allow retry for POST if explicitly enabled or for network errors
       // For POST, we usually don't retry unless we know it failed before reaching server. 
       // But for "Network Error" (no response), it is safe to retry idempotent requests, but POST is not always idempotent.
       // However, for "Suggestion", it's probably fine.
    }

    // Only retry on network errors (no response) or 5xx
    if (!error.response || (error.response.status >= 500 && error.response.status < 600)) {
        // Retry
    } else {
        return Promise.reject(error);
    }
    
    config.__retryCount = config.__retryCount || 0;
    const maxRetries = config.retryCount || 3;
    
    if (config.__retryCount >= maxRetries) {
      return Promise.reject(error);
    }
    
    config.__retryCount += 1;
    
    const delay = 1000 * Math.pow(2, config.__retryCount - 1);
    console.log(`Network error, retrying request... attempt ${config.__retryCount} in ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return api(config);
  }
);

export default api;
