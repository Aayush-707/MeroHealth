import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Temporary default user setup
  const [user, setUser] = useState({
    email: 'test@patient.com',
    name: 'John Doe',
    role: 'Patient',
    age: '30',
    gender: 'Male'
  });
  
  const [role, setRole] = useState('Patient');

  const login = async (email, password) => {
    // Bypassed login for temporary access
    return user; // Return the default user
  };

  const register = async (userData) => {
    const existingUsers = JSON.parse(await AsyncStorage.getItem('users')) || [];
    existingUsers.push(userData);
    await AsyncStorage.setItem('users', JSON.stringify(existingUsers));
  };

  return (
    <UserContext.Provider value={{ user, role, login, register }}>
      {children}
    </UserContext.Provider>
  );
};