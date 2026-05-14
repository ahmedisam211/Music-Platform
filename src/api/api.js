import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Your Node.js server address

const apiClient = axios.create({
    baseURL: API_URL,
});

// Add token to requests if user is logged in
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const api = {
    tracks: {
        list: () => apiClient.get('/tracks').then(res => res.data),
        create: (data) => apiClient.post('/tracks', data),
        update: (id, data) => apiClient.put(`/tracks/${id}`, data),
        delete: (id) => apiClient.delete(`/tracks/${id}`),
    },
    auth: {
        me: () => apiClient.get('/auth/me').then(res => res.data).catch(() => null),
        login: (email, password) => apiClient.post('/auth/login', { email, password }),
        register: (data) => apiClient.post('/auth/register', data),
    },
    social: {
        getComments: (trackId) => apiClient.get(`/tracks/${trackId}/comments`).then(res => res.data),
        addComment: (data) => apiClient.post('/comments', data),
        follow: (targetEmail) => apiClient.post('/follow', { targetEmail }),
    }
};