import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
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
      await api.put(`/medications/${medication.id}/`, {
        name: medicine.name,
        instructions: medicine.instructions,
      });

      const timeString =
        medicine.time instanceof Date
          ? medicine.time.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          : medicine.time;

      await api.put(`/medications/schedules/${medicationId}/`, {
        medication: medication.id,
        dosage: medicine.dosage,
        time: timeString,
        frequency: medicine.frequency,
        timing: medicine.timing,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <TextInput
            label="Medicine Name"
            value={medicine.name}
            onChangeText={(text) => setMedicine({ ...medicine, name: text })}
            style={styles.input}
            mode="outlined"
            theme={{ roundness: 20, colors: { primary: '#007AFF' } }}
            textColor="#000"
          />

          <TextInput
            label="Instructions"
            value={medicine.instructions}
            onChangeText={(text) => setMedicine({ ...medicine, instructions: text })}
            style={styles.input}
            multiline
            mode="outlined"
            theme={{ roundness: 20, colors: { primary: '#007AFF' } }}
            textColor="#000"
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={medicine.frequency}
              onValueChange={(itemValue) => setMedicine({ ...medicine, frequency: itemValue })}
              style={styles.picker}
              mode="dropdown"
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
              mode="dropdown"
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
            onChangeText={(text) => setMedicine({ ...medicine, dosage: text })}
            style={styles.input}
            mode="outlined"
            theme={{ roundness: 20, colors: { primary: '#007AFF' } }}
            textColor="#000"
          />

          <TouchableOpacity onPress={() => setVisible(true)} style={styles.timeButton}>
            <Text style={styles.timeButtonText}>
              {medicine.time instanceof Date
                ? medicine.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                : 'Select Time'}
            </Text>
          </TouchableOpacity>

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
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleUpdate} style={styles.button} labelStyle={styles.buttonText}>
          Update
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollContainer: {
    padding: 25,
    paddingBottom: 100, // Ensures space at the bottom when scrolling
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  picker: {
    height: 52,
    width: '100%',
    color: '#000',
  },
  timeButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#808080',
  },
  timeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  button: {
    backgroundColor: '#1a237e',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
