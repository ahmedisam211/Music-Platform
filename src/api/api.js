import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const api = {
    auth: {
        me: () => apiClient.get('/auth/me').then(res => res.data).catch(() => null),
        loginViaEmailPassword: (email, password) => apiClient.post('/auth/login', { email, password }),
        register: (data) => apiClient.post('/auth/register', data),
        // Added placeholders to prevent crashes in Login/Register pages
        loginWithProvider: () => { alert("Google login requires server setup."); },
        resetPasswordRequest: (email) => apiClient.post('/auth/reset-request', { email }),
    },
    tracks: {
        list: () => apiClient.get('/tracks').then(res => res.data || []),
    },
    // This 'entities' object is CRITICAL because AdminPanel.jsx uses this exact syntax
    entities: {
        Track: {
            list: () => apiClient.get('/tracks').then(res => res.data || []),
            create: (data) => apiClient.post('/tracks', data),
            update: (id, data) => apiClient.put(`/tracks/${id}`, data),
            delete: (id) => apiClient.delete(`/tracks/${id}`),
            filter: (params) => apiClient.get('/tracks/filter', { params }).then(res => res.data || []),
        },
        TrackRequest: {
            list: () => apiClient.get('/requests').then(res => res.data || []),
            create: (data) => apiClient.post('/requests', data),
            update: (id, data) => apiClient.put(`/requests/${id}`, data),
        },
        User: {
            list: () => apiClient.get('/users').then(res => res.data || []),
        },
        Comment: {
            filter: (params) => apiClient.get('/comments', { params }).then(res => res.data || []),
            create: (data) => apiClient.post('/comments', data),
        },
        Message: {
            filter: (params) => apiClient.get('/messages', { params }).then(res => res.data || []),
            create: (data) => apiClient.post('/messages', data),
        },
        Follow: {
            list: () => apiClient.get('/follows').then(res => res.data || []),
            filter: (params) => apiClient.get('/follows', { params }).then(res => res.data || []),
            create: (data) => apiClient.post('/follows', data),
            delete: (id) => apiClient.delete(`/follows/${id}`),
        },
        HypedTrack: {
            filter: (params) => apiClient.get('/hype', { params }).then(res => res.data || []),
            create: (data) => apiClient.post('/hype', data),
        }
    }
};