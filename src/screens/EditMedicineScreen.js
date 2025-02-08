// src/screens/EditMedicineScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MedicineContext } from '../context/MedicineContext';
import api from '../services/api';

export default function EditMedicineScreen({ route, navigation }) {
  const { medicationId, medication, schedule } = route.params;
  const [visible, setVisible] = useState(false);
  const [medicine, setMedicine] = useState({
    name: medication?.name || '',
    instructions: medication?.instructions || '',
    dosage: schedule?.dosage || '',
    frequency: schedule?.frequency || '',
    timing: schedule?.timing || '',
    time: schedule?.time ? new Date(`1970-01-01T${schedule.time}`) : new Date(),
  });

    const { refreshMedicines } = useContext(MedicineContext);

    const handleUpdate = async () => {
      try {
        // First update medication details using correct medication ID
        await api.put(`/medications/${medication.id}/`, {
          name: medicine.name,
          instructions: medicine.instructions
        });
    
        // Format time string for backend
        const timeString = medicine.time instanceof Date 
          ? medicine.time.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
          : medicine.time;
    
        // Then update schedule details using schedule ID
        await api.put(`/medications/schedules/${medicationId}/`, {
          medication: medication.id, // Use medication.id here
          dosage: medicine.dosage,
          time: timeString,
          frequency: medicine.frequency,
          timing: medicine.timing
        });
    
        await refreshMedicines();
        Alert.alert('Success', 'Medication updated successfully');
        navigation.goBack();
      } catch (error) {
        console.error('Error updating medication:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to update medication. Please try again.');
      }
    };
    

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Edit Medication</Title>

      <TextInput
        label="Medicine Name"
        value={medicine.name}
        onChangeText={text => setMedicine({ ...medicine, name: text })}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Instructions"
        value={medicine.instructions}
        onChangeText={text => setMedicine({ ...medicine, instructions: text })}
        style={styles.input}
        multiline
        mode="outlined"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={medicine.frequency}
          onValueChange={(itemValue) => setMedicine({ ...medicine, frequency: itemValue })}
          style={styles.picker}
        >
          <Picker.Item label="Select Frequency" value="" />
          <Picker.Item label="Daily" value="DAILY" />
          <Picker.Item label="Weekly" value="WEEKLY" />
          <Picker.Item label="Monthly" value="MONTHLY" />
          <Picker.Item label="As Needed" value="AS_NEEDED" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={medicine.timing}
          onValueChange={(itemValue) => setMedicine({ ...medicine, timing: itemValue })}
          style={styles.picker}
        >
          <Picker.Item label="Select Timing" value="" />
          <Picker.Item label="Before Meal" value="BEFORE_MEAL" />
          <Picker.Item label="After Meal" value="AFTER_MEAL" />
          <Picker.Item label="With Meal" value="WITH_MEAL" />
          <Picker.Item label="Any Time" value="ANY_TIME" />
        </Picker>
      </View>

      <TextInput
        label="Dosage"
        value={medicine.dosage}
        onChangeText={text => setMedicine({ ...medicine, dosage: text })}
        style={styles.input}
        mode="outlined"
      />

      <Button
        mode="outlined"
        onPress={() => setVisible(true)}
        style={styles.timeButton}
      >
        {medicine.time instanceof Date 
          ? medicine.time.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })
          : 'Select Time'
        }
      </Button>

      {visible && (
        <DateTimePicker
          value={medicine.time instanceof Date ? medicine.time : new Date()}
          mode="time"
          display="spinner"
          onChange={(event, selectedTime) => {
            setVisible(false);
            if (selectedTime) {
              setMedicine({ ...medicine, time: selectedTime });
            }
          }}
        />
      )}

      <Button 
        mode="contained" 
        onPress={handleUpdate}
        style={styles.button}
      >
        Update Medication
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  timeButton: {
    marginVertical: 15,
  },
  button: {
    marginTop: 20,
  },
});
