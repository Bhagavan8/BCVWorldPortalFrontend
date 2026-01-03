import axios from '../../api/axios'; // Assuming there is a configured axios instance, or use 'axios' directly if base URL is needed

const PUBLIC_API_URL = 'http://localhost:8081/api/public/news'; // Adjust base URL as needed

class NewsService {
    getAllNews() {
        return axios.get(PUBLIC_API_URL);
    }

    getNewsById(id) {
        return axios.get(`${PUBLIC_API_URL}/${id}`);
    }

    getRecentNews() {
        return axios.get(`${PUBLIC_API_URL}/recent`);
    }
}

export default new NewsService();
