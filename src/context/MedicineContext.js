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
      const response = await api.get('/medications/schedules/');
      setMedicines(response.data); // Set medicines from backend
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  const addMedicine = async (medicine) => {
    try {
      const response = await api.post('/medications/schedules/', medicine);
      const newMedicine = response.data;
      setMedicines((prev) => [...prev, newMedicine]); // Add new medicine to state
      scheduleNotification(newMedicine);
    } catch (error) {
      console.error('Error adding medicine:', error);
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

  return (
    <MedicineContext.Provider value={{ medicines, addMedicine }}>
      {children}
    </MedicineContext.Provider>
  );
};
