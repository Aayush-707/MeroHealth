import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker'; // Changed import
import { MedicineContext } from '../context/MedicineContext';

export default function AddMedicineScreen({ navigation }) {
  const [medicine, setMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: new Date()
  });
  
  const [showPicker, setShowPicker] = useState(false); // Changed state name
  const { addMedicine } = useContext(MedicineContext);

  const handleSubmit = () => {
    addMedicine(medicine);
    navigation.goBack();
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setMedicine({ ...medicine, time: selectedDate });
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Add New Medicine</Title>

      <TextInput
        label="Medicine Name"
        value={medicine.name}
        onChangeText={text => setMedicine({ ...medicine, name: text })}
        style={styles.input}
      />

      <TextInput
        label="Dosage"
        value={medicine.dosage}
        onChangeText={text => setMedicine({ ...medicine, dosage: text })}
        style={styles.input}
      />

      <TextInput
        label="Frequency"
        value={medicine.frequency}
        onChangeText={text => setMedicine({ ...medicine, frequency: text })}
        style={styles.input}
      />

      <Button 
        mode="outlined" 
        onPress={() => setShowPicker(true)}
        style={styles.timeButton}
      >
        {medicine.time.toLocaleTimeString()}
      </Button>

      {showPicker && (
        <DateTimePicker
          value={medicine.time}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleTimeChange}
        />
      )}

      <Button 
        mode="contained" 
        onPress={handleSubmit}
        style={styles.button}
      >
        Add Medicine
      </Button>
    </View>
  );
}

// Keep the same styles

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
  timeButton: {
    marginVertical: 15,
    paddingVertical: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 5,
  },
});