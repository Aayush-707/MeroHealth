import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = async (email, password) => {
    // Add actual authentication logic
    const userData = await AsyncStorage.getItem('users');
    const users = JSON.parse(userData);
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setRole(foundUser.role);
    }
    return foundUser;
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