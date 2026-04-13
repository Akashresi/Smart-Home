import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import PocketBase from 'pocketbase';

const getPbUrl = () => {
  const hostUri = Constants?.expoConfig?.hostUri;
  if (hostUri) {
    const pcIpAddress = hostUri.split(':')[0];
    return `http://${pcIpAddress}:8090`;
  }
  return 'http://127.0.0.1:8090';
};
export const pb = new PocketBase(getPbUrl());

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL && !process.env.EXPO_PUBLIC_API_URL.includes('localhost')) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  const hostUri = Constants?.expoConfig?.hostUri;
  if (hostUri) {
    const pcIpAddress = hostUri.split(':')[0];
    return `http://${pcIpAddress}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({ baseURL: getBaseUrl() });

api.interceptors.request.use(async (config) => {
  let token = await SecureStore.getItemAsync('token');
  if (!token && pb.authStore.isValid) {
    token = pb.authStore.token;
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
      router.replace('/(auth)/login');
    }
    return Promise.reject(err);
  }
);
export default api;
