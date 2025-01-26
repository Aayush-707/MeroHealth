import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import { UserContext } from '../context/UserContext';

export default function PatientRegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    age: '',
    gender: '',
    caregiverEmail: '',
    password: '',
  });

  const { register } = useContext(UserContext);

  const handleRegister = () => {
    register({ ...formData, role: 'Patient' });
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Patient Registration</Title>

      {Object.keys(formData).map((field) => (
        <TextInput
          key={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          value={formData[field]}
          onChangeText={(text) => setFormData({ ...formData, [field]: text })}
          style={styles.input}
          secureTextEntry={field === 'password'}
          keyboardType={
            field === 'email' || field === 'caregiverEmail' 
              ? 'email-address' 
              : field === 'age' 
              ? 'numeric' 
              : 'default'
          }
        />
      ))}

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
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
  button: {
    marginTop: 20,
    paddingVertical: 5,
  },
});