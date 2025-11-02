import api from './api';

export const jobService = {

    getAllJobs: () => api.get('/jobs'),


    getJobsPaginated: (page = 0, size = 10, sortBy = 'createdAt') =>
        api.get(`/jobs/paginated?page=${page}&size=${size}&sortBy=${sortBy}`),


    getJobById: (id) => api.get(`/jobs/${id}`),


    searchJobs: (keyword, page = 0, size = 10) =>
        api.get(`/jobs/search?keyword=${keyword}&page=${page}&size=${size}`),


    createJob: (jobData) => api.post('/jobs', jobData),


    getMyJobs: () => api.get('/jobs/my-jobs'),


    getMyAssignments: () => api.get('/jobs/my-assignments'),


    updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),


    deleteJob: (id) => api.delete(`/jobs/${id}`),


    updateJobStatus: (id, status) => api.patch(`/jobs/${id}/status?status=${status}`)
};