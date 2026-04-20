import axios from 'axios';

//localhost
// const api = axios.create({
//     baseURL: 'http://localhost:3001/api/admin',
//     timeout: 10000,
// });


//test deploy
const API_BASE_URL = 'https://prissy-agent-pants.ngrok-free.dev/api/admin';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

// 仪表盘
export const getDashboardStats = () => api.get('/dashboard/stats');

// 农场管理
export const getFarms = () => api.get('/farms');

// 方案审核
export const getPlans = () => api.get('/plans');

export default api;