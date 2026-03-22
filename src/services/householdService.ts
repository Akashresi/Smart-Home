import api from './api';
export default {
  createHousehold: (name: string) => api.post('/household/create', { name }),
  joinHousehold: (inviteCode: string) => api.post('/household/join', { inviteCode }),
  getMembers: () => api.get('/household/members')
};
