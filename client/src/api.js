import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Kayıt
export const register = (data) => api.post('/auth/register', data);

// Giriş
export const login = (data) => api.post('/auth/login', data);

// Günlük girişi ekle
export const addEntry = (data, token) =>
  api.post('/diary/new', data, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Günlükleri listele
export const getEntries = (token) =>
  api.get('/diary/list', {
    headers: { Authorization: `Bearer ${token}` }
  });
