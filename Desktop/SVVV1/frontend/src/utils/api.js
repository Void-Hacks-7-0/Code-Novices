import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('securefin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('securefin_token');
            localStorage.removeItem('securefin_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth endpoints
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    updateUID: (data) => api.put('/auth/uid', data),
    updatePin: (data) => api.put('/auth/pin', data)
};

// Transaction endpoints
export const transactionAPI = {
    getAll: () => api.get('/transactions'),
    receive: (data) => api.post('/transactions/receive', data),
    send: (data) => api.post('/transactions/send', data),
    getHistory: () => api.get('/transactions/history')
};

// Blockchain endpoints
export const blockchainAPI = {
    getLedger: () => api.get('/blockchain/ledger'),
    getAllLedger: () => api.get('/blockchain/ledger/all'),
    getBlock: (blockNumber) => api.get(`/blockchain/block/${blockNumber}`)
};

// Leaderboard endpoints
export const leaderboardAPI = {
    get: () => api.get('/leaderboard')
};

export default api;
