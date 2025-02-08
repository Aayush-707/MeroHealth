import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Title } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MedicineContext } from "../context/MedicineContext";
import { Picker } from "@react-native-picker/picker";

const AddMedicineScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [medicine, setMedicine] = useState({
    name: "",
    instructions: "",
    dosage: "",
    frequency: "",
    timing: "",
    time: new Date(),
  });

  const { createMedicationWithSchedule } = useContext(MedicineContext);

  const handleSubmit = async () => {
    // Format time for backend
    const formattedTime = medicine.time instanceof Date 
      ? medicine.time.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      : medicine.time;

    const result = await createMedicationWithSchedule({
      ...medicine,
      time: formattedTime
    });

    if (result) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Add Medication</Title>

      <TextInput
        label="Medicine Name"
        value={medicine.name}
        onChangeText={(text) => setMedicine({ ...medicine, name: text })}
        style={styles.input}
        mode="outlined"
        theme={{ roundness: 20 }}
      />

      <TextInput
        label="Instructions"
        value={medicine.instructions}
        onChangeText={(text) => setMedicine({ ...medicine, instructions: text })}
        style={styles.input}
        multiline
        mode="outlined"
        theme={{ roundness: 20 }}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={medicine.frequency}
          onValueChange={(itemValue) =>
            setMedicine({ ...medicine, frequency: itemValue })
          }
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
          onValueChange={(itemValue) =>
            setMedicine({ ...medicine, timing: itemValue })
          }
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
        onChangeText={(text) => setMedicine({ ...medicine, dosage: text })}
        style={styles.input}
        mode="outlined"
        theme={{ roundness: 20 }}
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
          : 'Select Time'}
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
        onPress={handleSubmit}
        style={styles.button}
      >
        Add Medication
      </Button>
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
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 20,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    height: 52,
    width: "100%",
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
