import api from './api';

export const jobService = {
  getJobs: (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.skills && filters.skills.length > 0) {
      filters.skills.forEach(skill => params.append('skills', skill));
    }
    if (filters.minBudget) params.append('minBudget', filters.minBudget);
    if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);
    if (filters.jobType) params.append('jobType', filters.jobType);

    return api.get('/jobs', { params });
  },

  createJob: (jobData) => api.post('/jobs', jobData),

  getJob: (id) => api.get(`/jobs/${id}`),

  submitProposal: (proposalData) => api.post('/proposals', proposalData),
  
  getMyJobs: () => api.get('/jobs/my-jobs'),
};