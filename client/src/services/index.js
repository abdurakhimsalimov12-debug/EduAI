import api from './api.js';

// Auth
export const authService = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  updateMe: (data) => api.patch('/auth/me', data).then((r) => r.data),
};

// Subjects
export const subjectService = {
  list: () => api.get('/subjects').then((r) => r.data),
  get: (idOrSlug) => api.get(`/subjects/${idOrSlug}`).then((r) => r.data),
  create: (data) => api.post('/subjects', data).then((r) => r.data),
  update: (id, data) => api.patch(`/subjects/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/subjects/${id}`).then((r) => r.data),
};

// Lessons
export const lessonService = {
  list: (params) => api.get('/lessons', { params }).then((r) => r.data),
  get: (id) => api.get(`/lessons/${id}`).then((r) => r.data),
  create: (data) => api.post('/lessons', data).then((r) => r.data),
  update: (id, data) => api.patch(`/lessons/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/lessons/${id}`).then((r) => r.data),
};

// Quizzes
export const quizService = {
  list: (params) => api.get('/quizzes', { params }).then((r) => r.data),
  get: (id) => api.get(`/quizzes/${id}`).then((r) => r.data),
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }).then((r) => r.data),
  results: (id) => api.get(`/quizzes/${id}/results`).then((r) => r.data),
};

// Progress
export const progressService = {
  get: () => api.get('/progress').then((r) => r.data),
  history: () => api.get('/progress/history').then((r) => r.data),
  markLesson: (lessonId) => api.post(`/progress/lessons/${lessonId}`).then((r) => r.data),
  unmarkLesson: (lessonId) => api.delete(`/progress/lessons/${lessonId}`).then((r) => r.data),
};

// AI
export const aiService = {
  chat: (payload) => api.post('/ai/chat', payload).then((r) => r.data),
  usage: () => api.get('/ai/usage').then((r) => r.data),
};

// Admin
export const adminService = {
  users: () => api.get('/admin/users').then((r) => r.data),
  setRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }).then((r) => r.data),
  stats: () => api.get('/admin/stats').then((r) => r.data),
};

// Xatolikdan foydalanuvchiga ko'rsatiladigan xabarni ajratib oladi.
export function errorMessage(err, fallback = 'errors.generic') {
  return err?.response?.data?.message || fallback;
}
