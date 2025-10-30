import api from './api';

export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),

  register: (userData, role) => 
    api.post(`/auth/register/${role.toLowerCase()}`, userData),

  getProfile: () => api.get('/auth/profile'),
};