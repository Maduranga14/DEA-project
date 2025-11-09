import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

api.interceptors.request.use((config) => {
  
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  
  const csrfToken = getCookie('XSRF-TOKEN');
  if (csrfToken && !token) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      
      const url = error.config?.url || '';
      const publicEndpoints = ['/jobs', '/applications/job/', '/applications/count'];
      
      
      const isPublicEndpoint = publicEndpoints.some(endpoint => url.includes(endpoint));
      
      if (!isPublicEndpoint) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('userData');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        localStorage.removeItem('rememberMe');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;