import React, { createContext, useState } from 'react';
import api from '../services/api';

export const CaregiverContext = createContext();

export const CaregiverProvider = ({ children }) => {
  const [caregivers, setCaregivers] = useState([]);

  const fetchCaregivers = async () => {
    try {
      const response = await api.get('/users/caregivers/');
      setCaregivers(response.data);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
    }
  };

  const linkCaregiver = async (caregiverData) => {
    try {
      const response = await api.post('/users/caregivers/add/', caregiverData);
      await fetchCaregivers();
      return response.data;
    } catch (error) {
      console.error('Error linking caregiver:', error);
      throw error;
    }
  };

  return (
    <CaregiverContext.Provider value={{ caregivers, fetchCaregivers, linkCaregiver }}>
      {children}
    </CaregiverContext.Provider>
  );
};
