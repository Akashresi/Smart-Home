import api from './api';

const getCleanings = () => api.get('/cleanings');
const createCleaning = (cleaning) => api.post('/cleanings', cleaning);

export default { getCleanings, createCleaning };
