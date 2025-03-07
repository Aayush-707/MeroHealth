import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import moment from 'moment-timezone';
import { useFocusEffect } from '@react-navigation/native';
import { Card, Title, Paragraph, Button, Divider, IconButton } from 'react-native-paper';
import { MedicineContext } from '../context/MedicineContext';
import api from '../services/api';

export default function MedicationDetailScreen({ route, navigation }) {
  const { medicationId } = route.params;
  const [medication, setMedication] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { deleteMedicine, refreshMedicines } = useContext(MedicineContext);

  useFocusEffect(
    React.useCallback(() => {
      fetchMedicationDetails();
    }, [medicationId])
  );

  const fetchMedicationDetails = async () => {
    try {
      setIsLoading(true);
      const scheduleResponse = await api.get(`/medications/schedules/${medicationId}/`);
      setSchedule(scheduleResponse.data);
      
      if (scheduleResponse.data.medication_details) {
        setMedication(scheduleResponse.data.medication_details);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      Alert.alert('Error', 'Failed to load medication details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (!schedule?.medication_details) {
      Alert.alert('Error', 'Unable to edit medication. Details not found.');
      return;
    }

    navigation.navigate('EditMedicine', {
      medicationId: schedule.id,
      medication: schedule.medication_details,
      schedule: schedule
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: confirmDelete 
        }
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      if (!medication?.id) {
        throw new Error('Medication ID not found');
      }
      await api.delete(`/medications/${medication.id}/`);
      await refreshMedicines();
      Alert.alert("Success", "Medication deleted successfully");
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting medication:', error);
      Alert.alert("Error", "Failed to delete medication");
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time not set';
    try {
      // Handle ISO string format
      if (timeString.includes('T') && timeString.includes('Z')) {
        return moment.utc(timeString).tz('Asia/Kathmandu').format('hh:mm A');
      }
      
      // Handle HH:MM format
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
  

  const formatText = (value) => {
    const mapping = {
      DAILY: 'Daily',
      WITH_MEAL: 'With Meal'
    };
    return mapping[value] || value;
  };

  if (isLoading) {
    return <View style={styles.loading}><Title>Loading...</Title></View>;
  }

  if (!medication || !schedule) {
    return (
      <View style={styles.loading}>
        <Title>No medication details found</Title>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Title style={styles.title}>{medication.name}</Title>
            <View style={styles.actionButtons}>
              <IconButton icon="pencil" size={24} onPress={handleEdit} style={styles.editButton} />
              <IconButton icon="delete" size={24} onPress={handleDelete} style={styles.deleteButton} color="red" />
            </View>
          </View>
          <Divider style={styles.divider} />
          
          <Title style={styles.sectionTitle}>Medication Details</Title>
          <Paragraph>Instructions: {medication.instructions}</Paragraph>

          <Title style={styles.sectionTitle}>Schedule Details</Title>
          <Paragraph>Dosage: {schedule.dosage}</Paragraph>
          <Paragraph>Frequency: {formatText(schedule.frequency)}</Paragraph>
          <Paragraph>Timing: {formatText(schedule.timing)}</Paragraph>
          <Paragraph>Time: {formatTime(schedule.time)}</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 6,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: 8,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
