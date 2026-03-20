import api from './api';

const getMaintenance = () => api.get('/maintenance');
const addMaintenanceItem = (item) => api.post('/maintenance', item);

export default { getMaintenance, addMaintenanceItem };
