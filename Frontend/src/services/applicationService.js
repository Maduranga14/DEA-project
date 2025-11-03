import api from './api';

export const applicationService = {
  // Apply for a job (freelancers)
  applyForJob: (applicationData) => api.post('/applications', applicationData),

  // Get my applications (freelancer)
  getMyApplications: () => api.get('/applications/my-applications'),

  // Get applications for a specific job (client)
  getApplicationsForJob: (jobId) => api.get(`/applications/job/${jobId}`),

  // Get applications for all my jobs (client)
  getApplicationsForMyJobs: () => api.get('/applications/my-jobs'),

  // Get specific application by ID
  getApplicationById: (applicationId) => api.get(`/applications/${applicationId}`),

  // Update application status (client)
  updateApplicationStatus: (applicationId, status, feedback) => 
    api.patch(`/applications/${applicationId}/status?status=${status}${feedback ? `&feedback=${encodeURIComponent(feedback)}` : ''}`),

  // Accept application (client)
  acceptApplication: (applicationId, feedback) => 
    api.patch(`/applications/${applicationId}/accept${feedback ? `?feedback=${encodeURIComponent(feedback)}` : ''}`),

  // Reject application (client)
  rejectApplication: (applicationId, feedback) => 
    api.patch(`/applications/${applicationId}/reject${feedback ? `?feedback=${encodeURIComponent(feedback)}` : ''}`),

  // Shortlist application (client)
  shortlistApplication: (applicationId) => 
    api.patch(`/applications/${applicationId}/shortlist`),

  // Withdraw application (freelancer)
  withdrawApplication: (applicationId) => 
    api.patch(`/applications/${applicationId}/withdraw`),

  // Get application count for a job (public)
  getApplicationCount: (jobId) => api.get(`/applications/job/${jobId}/count`)
};