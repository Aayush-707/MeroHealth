import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card, Title, Paragraph, Button, Divider, IconButton } from 'react-native-paper';
import { MedicineContext } from '../context/MedicineContext';
import api from '../services/api';

export default function MedicationDetailScreen({ route, navigation }) {
  // Safely extract medicationId from route.params; provide fallback if undefined.
  const { medicationId } = route?.params || {};
  const { deleteMedicine } = useContext(MedicineContext);
  
  const [medication, setMedication] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { deleteMedicine, refreshMedicines } = useContext(MedicineContext);

  // Use useFocusEffect instead of useEffect for better screen focus handling
  useFocusEffect(
    React.useCallback(() => {
      fetchMedicationDetails();
    }, [medicationId])
  );

  const fetchMedicationDetails = async () => {
    try {
      // First fetch the schedule details since it contains medication_details
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

  // Rest of your render code remains the same...

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

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
        <View style={styles.headerContainer}>
            <Title style={styles.title}>{medication.name}</Title>
            <View style={styles.actionButtons}>
              <IconButton
                icon="pencil"
                size={24}
                onPress={handleEdit}
                style={styles.editButton}
              />
              <IconButton
                icon="delete"
                size={24}
                onPress={handleDelete}
                style={styles.deleteButton}
                color="red"
              />
            </View>
          </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    flex: 1,
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