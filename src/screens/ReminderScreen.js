import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import moment from 'moment-timezone';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import ReminderModal from '../components/ReminderModal';
import api from '../services/api';

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ReminderScreen() {
  const [reminders, setReminders] = useState([]);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shownReminders, setShownReminders] = useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();

  useFocusEffect(
    useCallback(() => {
      fetchReminders();
      return () => {};
    }, [])
  );

  // useEffect to run checkReminders whenever reminders are updated
  useEffect(() => {
    if (reminders.length > 0 && !loading) {
      checkReminders();
    }
  }, [reminders]);


  useEffect(() => {
    // Set up notification channels for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('medication-reminders', {
        name: 'Medication Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Request permission for notifications
    registerForNotifications();
    
    // Listen for notification responses
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { reminder_id } = response.notification.request.content.data;
      if (reminder_id) {
        const reminder = reminders.find(r => r.id === reminder_id);
        if (reminder) {
          setCurrentReminder(reminder);
          setModalVisible(true);
        }
      }
    });
    
    fetchReminders();
    const intervalId = setInterval(checkReminders, 3000); // Check every 10 seconds
    
    return () => {
      clearInterval(intervalId);
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const registerForNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      console.log('Initial notification permission status:', existingStatus);
      
      if (existingStatus !== 'granted') {
        console.log('Requesting notification permission...');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log('New permission status:', status);
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permission not granted');
        // Show an alert to the user explaining why notifications are important
        Alert.alert(
          "Notifications Required",
          "Please enable notifications in your device settings to receive medication reminders.",
          [{ text: "OK" }]
        );
      } else {
        console.log('Notification permission granted!');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const showNotification = async (title, body, data = {}) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: data,
          sound: true,
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        },
        trigger: null, // null means show immediately
      });
      console.log("Notification scheduled successfully");
    } catch (error) {
      console.error("Error scheduling notification:", error);
      // Show alert as fallback
      Alert.alert(title, body);
    }
  };

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/schedules/reminders/');
      console.log('Reminder times:', response.data.map(r => r.sent_time));
      setReminders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setError('Failed to load reminders');
      setLoading(false);
    }
  };
  
  const checkReminders = () => {
    const now = moment().tz('Asia/Kathmandu');
    const fiveMinutesAgo = moment().tz('Asia/Kathmandu').subtract(5, 'minutes');
    
    console.log('Running checkReminders with reminders:', reminders.map(r => 
      `${r.id}: ${r.status} - ${r.sent_time}`
    ));
    
    const dueReminder = reminders.find(reminder => {
      const reminderTime = moment.utc(reminder.sent_time).tz('Asia/Kathmandu');
      const isRecentReminder = reminderTime.isAfter(fiveMinutesAgo);
      
      // Check for both PENDING reminders and recently SENT ones
      return reminderTime.isSameOrBefore(now) && 
             (reminder.status === 'PENDING' || (reminder.status === 'SENT' && isRecentReminder)) && 
             !shownReminders.includes(reminder.id);
    });
  
    if (dueReminder) {
      console.log('DUE REMINDER FOUND:', dueReminder.id);
      
      // Update shown reminders first to prevent duplicates
      setShownReminders(prev => [...prev, dueReminder.id]);
      
      // Try both notification methods for better reliability
      showNotification(
        "Medication Reminder", 
        `Time to take ${dueReminder.schedule_details?.medication || 'your medication'}`,
        { reminder_id: dueReminder.id }
      );
      
      // Always show in-app alert
      Alert.alert(
        "Medication Reminder",
        `Time to take ${dueReminder.schedule_details?.medication || 'your medication'}`,
        [
          { 
            text: "Take Now", 
            onPress: () => handleTakeMedication(dueReminder.id) 
          },
          { 
            text: "Skip", 
            onPress: () => handleSkipMedication(dueReminder.id),
            style: "cancel" 
          }
        ]
      );
      
      // Set modal state after ensuring alert appears
      setCurrentReminder(dueReminder);
      setModalVisible(true);
    }
  };
  

  const handleTakeMedication = async (reminderId) => {
  try {
    // Update local state immediately to prevent duplicate alerts
    setReminders(prev => 
      prev.map(r => r.id === reminderId ? {...r, status: 'SENT'} : r)
    );
    
    // Close modal first
    setModalVisible(false);
    
    // Then update server
    await api.post(`/schedules/reminders/${reminderId}/mark-taken/`);
    
    // Refresh list after server update
    fetchReminders();
  } catch (error) {
    console.error('Error marking medication as taken:', error);
  }
};

  
const handleSkipMedication = async (reminderId) => {
  try {
    // Update local state immediately to prevent duplicate alerts
    setReminders(prev => 
      prev.map(r => r.id === reminderId ? {...r, status: 'SKIPPED'} : r)
    );
    
    // Close modal first
    setModalVisible(false);
    
    // Then update server
    await api.post(`/schedules/reminders/${reminderId}/mark-skipped/`);
    
    // Refresh list after server update
    fetchReminders();
  } catch (error) {
    console.error('Error marking medication as skipped:', error);
  }
};

  const renderReminderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.schedule_details?.medication || 'Medication'}</Title>
        <Paragraph>Dosage: {item.schedule_details?.dosage || 'N/A'}</Paragraph>
        <Paragraph>Frequency: {item.schedule_details?.frequency || 'N/A'}</Paragraph>
        <Paragraph>
        Date & Time: {moment.utc(item.sent_time).tz('Asia/Kathmandu').format('YYYY-MM-DD hh:mm:ss A')}
      </Paragraph>
        <Paragraph>Status: {item.status}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => handleTakeMedication(item.id)}
          disabled={item.status !== 'PENDING'}
          style={styles.actionButton}
        >
          Take
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => handleSkipMedication(item.id)}
          disabled={item.status !== 'PENDING'}
          style={styles.actionButton}
        >
          Skip
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reminders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.noRemindersText}>No reminders available</Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          renderItem={renderReminderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <ReminderModal
        visible={modalVisible}
        onClose={() => handleSkipMedication(currentReminder?.id)}
        onTake={() => handleTakeMedication(currentReminder?.id)}
        reminder={currentReminder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8,
  },
  actionButton: {
    marginHorizontal: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noRemindersText: {
    fontSize: 16,
    color: '#757575',
  },
});
