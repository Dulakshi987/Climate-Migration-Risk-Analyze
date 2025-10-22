import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

// Climate APIs
export const climateAPI = {
  getCurrentData: (city, country) => 
    api.get('/climate/current', { params: { city, country } }),
  getHistoricalData: (params) => 
    api.get('/climate/historical', { params })
};

// Risk APIs
export const riskAPI = {
  calculateRisk: (data) => api.post('/risk/calculate', data),
  getAssessments: (params) => api.get('/risk/assessments', { params }),
  getStatistics: () => api.get('/risk/statistics')
};

export default api;