import axios from 'axios';
import Constants from 'expo-constants';

// Dynamically get your computer's IP address so your phone/emulator can talk to the backend
const getBaseUrl = () => {
  // If the URL in .env is explicitly set and NOT just localhost, use it:
  if (process.env.EXPO_PUBLIC_API_URL && !process.env.EXPO_PUBLIC_API_URL.includes('localhost')) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // If running via Expo Go on device/emulator, automatically fetch your PC's IP address
  const hostUri = Constants?.expoConfig?.hostUri;
  if (hostUri) {
    const pcIpAddress = hostUri.split(':')[0]; // Extracts e.g. 192.168.1.5
    return `http://${pcIpAddress}:5000/api`;
  }
  
  // Fallback (for Web or if running differently)
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Add interceptor for token if implemented
export default api;
