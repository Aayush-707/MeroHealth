import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.137.1:8080/'; // Replace with your backend URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Request interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
      const originalRequest = error.config;
      
      if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
              const refreshToken = await AsyncStorage.getItem('refresh_token');
              const response = await api.post('/users/token/refresh/', {
                  refresh: refreshToken
              });
              
              const { access } = response.data;
              await AsyncStorage.setItem('access_token', access);
              
              originalRequest.headers['Authorization'] =  `Bearer ${access}`;
              return api(originalRequest);
          } catch (refreshError) {
              // Handle refresh failure - redirect to login
              return Promise.reject(refreshError);
          }
      }
      return Promise.reject(error);
  }
);


export default api;