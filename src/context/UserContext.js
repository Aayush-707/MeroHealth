import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login/', { email, password });
      const { access, refresh } = response.data;

      // Store tokens
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);

      // Fetch user profile
      const userResponse = await api.get('/users/profile/', {
        headers: { Authorization: `Bearer ${access}`}
      });

      setUser(userResponse.data);
      setRole(userResponse.data.user_type);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/users/register/', userData);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, role, login, register }}>
      {children}
    </UserContext.Provider>
  );
};