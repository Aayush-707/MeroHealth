import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Title } from 'react-native-paper';

export default function RoleSelectionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Select Your Role</Title>
      
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('PatientRegister')}
      >
        Patient
      </Button>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('CaregiverRegister')}
      >
        Caregiver
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
    paddingVertical: 5,
  },
});