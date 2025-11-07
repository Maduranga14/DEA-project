import api from './api';

export const dashboardService = {
    
    getStats: async () => {
        try {
            const response = await api.get('/api/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    
    getRecentActivities: async () => {
        try {
            const response = await api.get('/api/dashboard/activities');
            return response.data;
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            throw error;
        }
    },

    
    getAnalytics: async (period = '30d') => {
        try {
            const response = await api.get(`/api/dashboard/analytics?period=${period}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    }
};
