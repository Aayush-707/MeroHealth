import React, { createContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    refreshMedicines();
    loadMedicines();
    setupNotifications();
  }, []);

  //refresh function
  const refreshMedicines = async () => {
    try {
      console.log('Fetching medicines...'); // Debug log
      const response = await api.get('/medications/schedules/');
      setMedicines(response.data);
    } catch (error) {
      console.error('Error refreshing medicines:', error.response?.data || error);
    }
  };
  
  const loadMedicines = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      // Load all medication schedules from the backend
      const response = await api.get('/medications/schedules/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMedicines(response.data);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  // function to create medicaiton with schedule
  const createMedicationWithSchedule = async (medicationData) => {
    try {
      const response = await api.post('/medications/create-with-schedule/', {
        name: medicationData.name,
        instructions: medicationData.instructions,
        dosage: medicationData.dosage,
        time: medicationData.time,
        frequency: medicationData.frequency,
        timing: medicationData.timing,
        expires_at: new Date(Date.now() + 30*24*60*60*1000).toISOString() // 30 days from now
      });
      
      await refreshMedicines();
      return response.data;
    } catch (error) {
      console.error('Error creating medication:', error.response?.data || error.message);
      return null;
    }
  };

  // handleUpdate function for editing medications
  const handleUpdate = async (medicationId, updateData) => {
    try {
      // First update medication details
      await api.put(`/medications/${medicationId}/`, {
        name: updateData.name,
        instructions: updateData.instructions
      });

      // Then update schedule details
      await api.put(`/medications/schedules/${medicationId}/`, {
        medication: medicationId,
        dosage: updateData.dosage,
        time: updateData.time,
        frequency: updateData.frequency,
        timing: updateData.timing
      });

      // Refresh medicines list after update
      await refreshMedicines();
      return true;
    } catch (error) {
      console.error('Error updating medicine:', error);
      return false;
    }
  };


  // Delete a medication record by its ID
  const deleteMedicine = async (medicationId) => {
    try {
      // Delete schedule first
      await api.delete(`/medications/schedules/${medicationId}/`);
      // Then delete medication
      await api.delete(`/medications/${medicationId}/`);
      
      // Refresh medicines list after deletion
      await refreshMedicines();
      return true;
    } catch (error) {
      console.error('Error deleting medicine:', error);
      return false;
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
    // Assume medicine.time is a string that can initialize a Date properly.
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

  // Optionally, get individual medication details by medication id
  const getMedicationDetails = async (medicationId) => {
    try {
      const response = await api.get(`/medications/${medicationId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medication details:', error);
      return null;
    }
  };

  // And fetch schedule details by schedule id
  const getScheduleDetails = async (scheduleId) => {
    try {
      const response = await api.get(`/medications/schedules/${scheduleId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule details:', error);
      return null;
    }
  };

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        createMedicationWithSchedule,
        deleteMedicine,
        getMedicationDetails,
        getScheduleDetails,
        refreshMedicines,
        handleUpdate
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
};
