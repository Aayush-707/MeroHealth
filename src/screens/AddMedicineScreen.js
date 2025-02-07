import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput, Title } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MedicineContext } from "../context/MedicineContext";
import { Picker } from "@react-native-picker/picker";

const AddMedicineScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  // For toggling the DateTimePicker
  const [visible, setVisible] = useState(false);
  // To hold the medicine state including its ID (if created)
  const [medicine, setMedicine] = useState({
    name: "",
    instructions: "",
    dosage: "",
    frequency: "",
    timing: "",
    time: new Date(),
  });

  // To save the medicine record returned from the backend after step 1
  const [medicineId, setMedicineId] = useState(null);

  const { createMedicinePartial, updateMedicineDetails } =
    useContext(MedicineContext);

  const handleNextStep = async () => {
    if (step === 1) {
      // Create medicine with partial data (name & instructions)
      const partialData = {
        name: medicine.name,
        instructions: medicine.instructions,
      };
      const createdMedicine = await createMedicinePartial(partialData);
      if (createdMedicine) {
        setMedicineId(createdMedicine.id);
        setStep(2);
      }
    } else {
      // Format time in HH:mm:ss format for backend
      const formattedTime = medicine.time instanceof Date 
      ? medicine.time.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      : medicine.time;

      // Prepare the additional details for update
      const updateData = {
        dosage: medicine.dosage,
        frequency: medicine.frequency,
        timing: medicine.timing,
        time: formattedTime,
      };
      await updateMedicineDetails(medicineId, updateData);
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
            onChangeText={(text) => setMedicine({ ...medicine, name: text })}
            style={styles.input}
            mode="outlined"
            theme={{ roundness: 20 }}
          />

          <TextInput
            label="Instructions"
            value={medicine.instructions}
            onChangeText={(text) =>
              setMedicine({ ...medicine, instructions: text })
            }
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
            Next
          </Button>
        </>
      ) : (
        <>
          <Title style={styles.title}>Schedule</Title>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={medicine.frequency}
              onValueChange={(itemValue) =>
                setMedicine({ ...medicine, frequency: itemValue })
              }
              style={styles.picker}
              mode="outlined"
              theme={{ roundness: 20 }}
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
              mode="outlined"
              theme={{ roundness: 20 }}
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
              value={typeof medicine.time === 'string' 
                ? new Date(`1970-01-01T${medicine.time}`) 
                : medicine.time}
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
