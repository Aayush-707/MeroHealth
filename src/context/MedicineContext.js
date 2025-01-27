import React, { createContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MedicineContext = createContext();

export const MedicineProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    loadMedicines();
    setupNotifications();
  }, []);

  const loadMedicines = async () => {
    const storedMeds = await AsyncStorage.getItem('medicines');
    if (storedMeds) {
      const parsedMeds = JSON.parse(storedMeds, (key, value) => {
        if (key === 'time') return new Date(value);
        return value;
      });
      setMedicines(parsedMeds);
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

  const addMedicine = async (medicine) => {
    const newMedicine = {...medicine,nid: Date.now(),
      instructions: medicine.instructions || '' // Add this line
    };
    const updatedMeds = [...medicines, newMedicine];
    setMedicines(updatedMeds);
    await AsyncStorage.setItem('medicines', JSON.stringify(updatedMeds));
    scheduleNotification(newMedicine);
  };

  const scheduleNotification = async (medicine) => {
    const triggerTime = medicine.time instanceof Date 
      ? medicine.time 
      : new Date(medicine.time);

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

  const handleNotificationResponse = (response) => {
    const { medicineId } = response.notification.request.content.data;
    const medicine = medicines.find(m => m.id === medicineId);
    
    if (medicine) {
      const updatedMeds = medicines.map(m => 
        m.id === medicineId ? { ...m, status: response.actionIdentifier } : m
      );
      setMedicines(updatedMeds);
      AsyncStorage.setItem('medicines', JSON.stringify(updatedMeds));
    }
  };
  
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );
    return () => subscription.remove();
  }, [medicines]);
  
  return (
    <MedicineContext.Provider value={{ medicines, addMedicine }}>
      {children}
    </MedicineContext.Provider>
  );
};