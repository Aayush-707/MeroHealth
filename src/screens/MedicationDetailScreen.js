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
    fetchScheduleDetails();
  }, [medicationId]);

  const fetchMedicationDetails = async () => {
    try {
      const response = await api.get(`/medications/${medicationId}/`);
      setMedication(response.data);
    } catch (error) {
      console.error('Error fetching medication details:', error);
    }
  };

  const fetchScheduleDetails = async () => {
    try {
      const response = await api.get(`/medications/schedules/${medicationId}/`);
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule details:', error);
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
          <Paragraph>Created: {new Date(medication.created_at).toLocaleDateString()}</Paragraph>

          <Title style={styles.sectionTitle}>Schedule Details</Title>
          <Paragraph>Dosage: {schedule.dosage}</Paragraph>
          <Paragraph>Frequency: {schedule.frequency}</Paragraph>
          <Paragraph>Timing: {schedule.timing}</Paragraph>
          <Paragraph>Time: {new Date(schedule.time).toLocaleTimeString()}</Paragraph>
          <Paragraph>Status: {schedule.is_active ? 'Active' : 'Inactive'}</Paragraph>
          <Paragraph>Expires: {new Date(schedule.expires_at).toLocaleDateString()}</Paragraph>
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
