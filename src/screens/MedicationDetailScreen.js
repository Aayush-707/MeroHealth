import React, { useEffect, useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Divider } from 'react-native-paper';
import { MedicineContext } from '../context/MedicineContext';
import api from '../services/api';

export default function MedicationDetailScreen({ route, navigation }) {
  // Safely extract medicationId from route.params; provide fallback if undefined.
  const { medicationId } = route?.params || {};
  const { deleteMedicine } = useContext(MedicineContext);
  
  const [medication, setMedication] = useState(null);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    fetchMedicationDetails();
  }, [medicationId]);

  const fetchMedicationDetails = async () => {
    try {
      // First, fetch the schedule details since they contain medication details.
      const scheduleResponse = await api.get(`/medications/schedules/${medicationId}/`);
      setSchedule(scheduleResponse.data);
      
      // Then, if the response contains 'medication_details', use those for the medication.
      if (scheduleResponse.data.medication_details) {
        setMedication(scheduleResponse.data.medication_details);
      } else {
        // Otherwise, fetch medication details directly.
        const medicationResponse = await api.get(`/medications/${scheduleResponse.data.medication_id}/`);
        setMedication(medicationResponse.data);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time not set';
    try {
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

  // Delete handler: show a confirmation alert. If confirmed, call deleteMedicine and navigate back.
  const handleDelete = () => {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: async () => {
            await deleteMedicine(medicationId);
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  if (!medication || !schedule) {
    return (
      <View style={styles.loading}>
        <Title>Loading...</Title>
      </View>
    );
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
        <Card.Actions>
          <Button 
            mode="contained"
            onPress={handleDelete}
            style={styles.deleteButton}
          >
            Delete Medication
          </Button>
        </Card.Actions>
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
  deleteButton: {
    backgroundColor: 'red',
    marginTop: 16,
  },
});
