import api from './api';

export const profileService = {

    getProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },


    updateProfile: async (profileData) => {
        const response = await api.put('/profile', profileData);
        return response.data;
    },


    uploadProfilePicture: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/profile/picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },


    getProfilePictureUrl: (filename) => {
        if (!filename) return null;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/profile/picture/${filename}`;
    },
};