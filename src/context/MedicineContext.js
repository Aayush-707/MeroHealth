import React, { createContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    loadMedicines();
    setupNotifications();
  }, []);

  const loadMedicines = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await api.get('/medications/schedules/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMedicines(response.data);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  // Call this on the first screen to save medicine name and instructions
  const createMedicinePartial = async (partialMedicine) => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await api.post('/medications/', partialMedicine, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Optionally add the returned medicine to the medicines array
      setMedicines(prev => [...prev, response.data]);
      return response.data;  // Return the created medicine (including its ID)
    } catch (error) {
      console.error('Error creating medicine:', error);
      return null;
    }
  };

  // Call this on the second screen to update additional details
  const updateMedicineDetails = async (medicineId, details) => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await api.post(`/medications/schedules/${medicineId}/`, details, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Update state: replace the matched record with the updated response
      setMedicines(prev =>
        prev.map(med => (med.id === medicineId ? response.data : med))
      );
      // Optionally schedule updated notification if needed
      scheduleNotification(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating medicine details:', error);
      return null;
    }
  };

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  };

  const scheduleNotification = async (medicine) => {
    const triggerTime = new Date(medicine.time);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to take your medicine!",
        body: `${medicine.name} - ${medicine.dosage}`,
        data: { medicineId: medicine.id },
      },
      trigger: {
        hour: triggerTime.getHours(),
        minute: triggerTime.getMinutes(),
        repeats: true,
      },
    });
  };

const getMedicationDetails = async (medicationId) => {
  try {
    const response = await api.get(`/medications/${medicationId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medication details:', error);
    return null;
  }
};

  const getScheduleDetails = async (scheduleId) => {
    try {
      const response = await api.get(`/medications/schedules/${scheduleId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule details:', error);
      return null;
    }
  };

  // Add these to the context provider value
  return (
    <MedicineContext.Provider value={{ 
      medicines, 
      createMedicinePartial, 
      updateMedicineDetails,
      getMedicationDetails,
      getScheduleDetails
    }}>
      {children}
    </MedicineContext.Provider>
  );

};
