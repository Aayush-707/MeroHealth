import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import api from '../services/api';

const PatientMedicationsScreen = ({ route }) => {
  const { patientId } = route.params;
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPatientMedications();
  }, []);

  const fetchPatientMedications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/medications/schedules/patient/?user=${patientId}`);
      console.log('Fetching patient medications response:');
      setMedications(response.data);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // Handle ISO string format
    if (timeString.includes('T') && timeString.includes('Z')) {
      return moment.utc(timeString).tz('Asia/Kathmandu').format('hh:mm A');
    }
    
    // Handle HH:MM format
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {medications.length === 0 ? (
        <Text style={styles.emptyText}>No medications found for this patient</Text>
      ) : (
        medications.map((med) => (
          <Card key={med.id} style={styles.card}>
            <Card.Content>
              <Title style={styles.medicineTitle}>{med.medication_details.name}</Title>
              <Paragraph>Instructions: {med.medication_details.instructions}</Paragraph>
              <Paragraph>Dosage: {med.dosage}</Paragraph>
              <Paragraph>Time: {formatTime(med.time)}</Paragraph>
              <Paragraph>Frequency: {med.frequency}</Paragraph>
              <Paragraph>Timing: {med.timing.replace(/_/g, ' ')}</Paragraph>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  medicineTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  
});

export default PatientMedicationsScreen;
