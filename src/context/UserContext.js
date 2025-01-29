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
      console.log('Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error.message); // Log error message
      if (error.response) {
        console.error('Error response data:', error.response.data); // Log server response
        console.error('Error status:', error.response.status); // Log HTTP status code
      }
      return null;
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
