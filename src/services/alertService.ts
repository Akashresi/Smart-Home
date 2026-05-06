import api from './api';
export default {
  getAlerts: () => api.get('/alerts'),
  markRead: (id: string) => api.put(`/alerts/${id}/read`),
  markAllRead: () => api.put('/alerts/read-all'),
  broadcastAlert: (type: string, message: string) => api.post('/alerts/broadcast', { type, message })
};
