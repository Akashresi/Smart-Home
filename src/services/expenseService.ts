import api from './api';
export default {
  getExpenses: () => api.get('/expenses'),
  addExpense: (data: any) => api.post('/expenses', data),
  deleteExpense: (id: string) => api.delete(`/expenses/${id}`)
};
