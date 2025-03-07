import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import moment from 'moment-timezone';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import ReminderModal from '../components/ReminderModal';
import api from '../services/api';

export default function ReminderScreen() {
  const [reminders, setReminders] = useState([]);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shownReminders, setShownReminders] = useState([]);


  useFocusEffect(
    useCallback(() => {
      fetchReminders();
      return () => {};
    }, [])
  );

  useEffect(() => {
    fetchReminders();
    const intervalId = setInterval(checkReminders, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

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
    // Add a state variable to track shown reminders
    const dueReminder = reminders.find(reminder => {
      const reminderTime = moment.utc(reminder.sent_time).tz('Asia/Kathmandu');
      return reminderTime.isBefore(now) && 
             reminder.status === 'PENDING' && 
             !shownReminders.includes(reminder.id);
    });
  
    if (dueReminder) {
      setCurrentReminder(dueReminder);
      setModalVisible(true);
      // Add to shown reminders list
      setShownReminders(prev => [...prev, dueReminder.id]);
    }
  };
  

  const handleTakeMedication = async (reminderId) => {
    try {
      // Mark the reminder as taken
      await api.post(`/schedules/reminders/${reminderId}/mark-taken/`);
      
      // Refresh reminders list
      fetchReminders();
      setModalVisible(false);
    } catch (error) {
      console.error('Error marking medication as taken:', error);
    }
  };
  
  const handleSkipMedication = async (reminderId) => {
   try {
      //  Mark the reminder as skipped (only)
      await api.post(`/schedules/reminders/${reminderId}/mark-skipped/`); //Use new skip_medication endpoint
      
      // Refresh reminders list
      fetchReminders();
      setModalVisible(false);
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
