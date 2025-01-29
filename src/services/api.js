import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http:// 192.168.1.70:8080/'; // Replace with your backend URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Add a request interceptor to include tokens in headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token'); // Retrieve token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;