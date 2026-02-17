import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';

const base = API_BASE_URL;

const tryGet = async (urls, config = {}) => {
  let lastErr;
  for (const url of urls) {
    try {
      return await axios.get(url, { headers: { Accept: 'application/json' }, withCredentials: false, ...config });
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('All fallback requests failed');
};

class NewsService {
  getAllNews() {
    const urls = [
      `${base}/api/public/news`,
      `${base}/api/news`,
    ];
    return tryGet(urls, { retry: true, retryCount: 2 });
  }

  getNewsById(id) {
    const urls = [
      `${base}/api/public/news/${id}`,
      `${base}/api/news/${id}`,
    ];
    return tryGet(urls, { retry: false });
  }

  getRecentNews() {
    const urls = [
      `${base}/api/public/news/recent`,
      `${base}/api/news/recent`,
    ];
    return tryGet(urls, { retry: true, retryCount: 2 });
  }
}

export default new NewsService();
