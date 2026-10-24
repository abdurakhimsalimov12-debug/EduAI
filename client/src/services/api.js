import axios from 'axios';

// Dev'da Vite proxy /api ni backendga uzatadi.
// Prod'da VITE_API_URL ni to'liq backend manziliga qo'ying.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true, // HttpOnly cookie sessiyalari uchun (keyingi bosqich).
  timeout: 15000,
});

export default api;
