import axios from 'axios';
import Constants from 'expo-constants';

const getAiUrl = () => {
  if (process.env.EXPO_PUBLIC_AI_URL && !process.env.EXPO_PUBLIC_AI_URL.includes('localhost')) {
    return process.env.EXPO_PUBLIC_AI_URL;
  }
  const hostUri = Constants?.expoConfig?.hostUri;
  if (hostUri) {
    const pcIpAddress = hostUri.split(':')[0];
    return `http://${pcIpAddress}:8000/api/v1`;
  }
  return 'http://localhost:8000/api/v1';
};

const aiApi = axios.create({ baseURL: getAiUrl() });

export default {
  getSuggestions: (items: any) => aiApi.post('/suggest-tasks', { items }, { headers: { 'Authorization': 'Bearer YOUR_AI_KEY' } }),
  predictLowInventory: (items: any) => aiApi.post('/predict-inventory', { items }, { headers: { 'Authorization': 'Bearer YOUR_AI_KEY' } })
};
