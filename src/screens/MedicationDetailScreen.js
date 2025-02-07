// src/screens/MedicationDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Divider } from 'react-native-paper';
import api from '../services/api';

export default function MedicationDetailScreen({ route, navigation }) {
  const { medicationId } = route.params;
  const [medication, setMedication] = useState(null);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    fetchMedicationDetails();
  }, [medicationId]);

  // MedicationDetailScreen.js
  const fetchMedicationDetails = async () => {
    try {
      // First fetch the schedule details since it contains medication_details
      const scheduleResponse = await api.get(`/medications/schedules/${medicationId}/`);
      setSchedule(scheduleResponse.data);
      
      // Get medication details from the schedule's medication_details
      if (scheduleResponse.data.medication_details) {
        setMedication(scheduleResponse.data.medication_details);
      } else {
        // Fallback to fetching medication directly if needed
        const medicationResponse = await api.get(`/medications/${scheduleResponse.data.medication_id}/`);
        setMedication(medicationResponse.data);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

// Remove separate fetchScheduleDetails function and just use one combined fetch
useEffect(() => {
  fetchMedicationDetails();
}, [medicationId]);


  const formatTime = (timeString) => {
    if (!timeString) return 'Time not set';
    try {
      // Handle time string from Django (HH:mm:ss format)
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  if (!medication || !schedule) {
    return <View style={styles.loading}><Title>Loading...</Title></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{medication.name}</Title>
          <Divider style={styles.divider} />
          
          <Title style={styles.sectionTitle}>Medication Details</Title>
          <Paragraph>Instructions: {medication.instructions}</Paragraph>

          <Title style={styles.sectionTitle}>Schedule Details</Title>
          <Paragraph>Dosage: {schedule.dosage}</Paragraph>
          <Paragraph>Frequency: {schedule.frequency}</Paragraph>
          <Paragraph>Timing: {schedule.timing}</Paragraph>
          <Paragraph>Time: {formatTime(schedule.time)}</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
