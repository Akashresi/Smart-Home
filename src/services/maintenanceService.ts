import api from './api';
export default {
  getMaintenance: () => api.get('/maintenance'),
  addMaintenance: (data: any) => api.post('/maintenance', data),
  updateMaintenance: (id: string, data: any) => api.put(`/maintenance/${id}`, data),
  deleteMaintenance: (id: string) => api.delete(`/maintenance/${id}`)
};
