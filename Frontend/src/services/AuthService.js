import api from './api';

export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),

  register: (userData) => 
    api.post(`/auth/register`, userData),

  logout: () => 
    api.post('/auth/logout'),

  getSessionInfo: () => 
    api.get('/auth/session-info'),

  getProfile: () => api.get('/auth/profile'),
};