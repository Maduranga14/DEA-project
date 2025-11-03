import api from './api';

export const applicationService = {
  
  applyForJob: (applicationData) => api.post('/applications', applicationData),

  
  getMyApplications: () => api.get('/applications/my-applications'),

  
  getApplicationsForJob: (jobId) => api.get(`/applications/job/${jobId}`),

  
  getApplicationsForMyJobs: () => {
    console.log('Fetching applications for my jobs...');
    return api.get('/applications/my-jobs');
  },

  
  getApplicationById: (applicationId) => api.get(`/applications/${applicationId}`),

 
  updateApplicationStatus: (applicationId, status, feedback) => 
    api.patch(`/applications/${applicationId}/status?status=${status}${feedback ? `&feedback=${encodeURIComponent(feedback)}` : ''}`),

  
  acceptApplication: (applicationId, feedback) => {
    const url = `/applications/${applicationId}/accept${feedback ? `?feedback=${encodeURIComponent(feedback)}` : ''}`;
    console.log('Accept API call:', { applicationId, feedback, url });
    return api.patch(url);
  },

  
    rejectApplication: (applicationId, feedback) => {
    const url = `/applications/${applicationId}/reject${feedback ? `?feedback=${encodeURIComponent(feedback)}` : ''}`;
    console.log('Reject API call:', { applicationId, feedback, url });
    return api.patch(url);
  },

  
  shortlistApplication: (applicationId) => 
    api.patch(`/applications/${applicationId}/shortlist`),

  
  withdrawApplication: (applicationId) => 
    api.patch(`/applications/${applicationId}/withdraw`),

  
  getApplicationCount: (jobId) => api.get(`/applications/job/${jobId}/count`)
};