import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { MedicineContext } from '../context/MedicineContext';


const AddMedicineScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [visible, setVisible] = useState(false);
  const [medicine, setMedicine] = useState({
    name: '',
    dosage: '',
    instructions: '',
    frequency: '',
    time: new Date(),
  });

  const { addMedicine } = useContext(MedicineContext);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else {
      addMedicine(medicine);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 ? (
        <>
          <Title style={styles.title}>Medication</Title>
          
          <TextInput
            label="Medicine Name"
            value={medicine.name}
            onChangeText={text => setMedicine({ ...medicine, name: text })}
            style={styles.input}
            mode="outlined"
            theme={{ roundness: 20 }}
          />

          <TextInput
            label="Instructions"
            value={medicine.instructions}
            onChangeText={text => setMedicine({ ...medicine, instructions: text })}
            style={styles.input}
            multiline
            mode="outlined"
            theme={{ roundness: 20 }}
          />

          <Button 
            mode="contained" 
            onPress={handleNextStep}
            style={styles.button}
          >
            Add Schedule
          </Button>
        </>
      ) : (
        <>
          <Title style={styles.title}>Schedule</Title>

          <TextInput
            label="Frequency"
            value={medicine.frequency}
            onChangeText={text => setMedicine({ ...medicine, frequency: text })}
            style={styles.input}
            mode="outlined"
            theme={{ roundness: 20 }}
          />

          <TextInput
            label="Dosage"
            value={medicine.dosage}
            onChangeText={text => setMedicine({ ...medicine, dosage: text })}
            style={styles.input}
            mode="outlined"
            theme={{ roundness: 20 }}
          />
          
          <Button 
            mode="outlined" 
            onPress={() => setVisible(true)}
            style={styles.timeButton}
          >
            {medicine.time.toLocaleTimeString()}
          </Button>

          {visible && (
            <DateTimePicker
              value={medicine.time}
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
            onPress={handleNextStep}
            style={styles.button}
          >
            Done
          </Button>
        </>
      )}
    </View>
  );
};

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

export default AddMedicineScreen;