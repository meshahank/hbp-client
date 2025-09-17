import axios from 'axios';

const baseURL = 'https://hbp-api.onrender.com/api';
// const baseURL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    // These headers instruct the browser and proxies to not cache API requests.
    // This forces a fresh request to the server every time, avoiding 304 responses.
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // For 401 errors, just log it and let the AuthContext handle the logout
      console.log('401 error received, letting AuthContext handle logout');
    }
    return Promise.reject(error);
  }
);

export default api;
