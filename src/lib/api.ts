import axios from 'axios';

const isDevelopment = window.location.hostname === 'localhost';
const baseURL = isDevelopment ? '/api' : 'http://localhost:5000/api';

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
      // Only redirect if user was previously authenticated
      const wasAuthenticated = localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect to login if the user was authenticated and is on a protected route
      if (wasAuthenticated && window.location.pathname !== '/' && 
          window.location.pathname !== '/login' && 
          window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
