import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle responses (e.g., transform data)
    return response.data; // Return only data
  },
  (error) => {
    // Handle response errors (e.g., logging, notifications)
    return Promise.reject(error.response || error.message);
  }
);

export default axiosInstance;