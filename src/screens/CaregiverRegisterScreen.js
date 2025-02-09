import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import api from '../services/api';

export default function CaregiverRegistration({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleRegister = async () => {
    try {
      await api.post('/users/register/', {
        email,
        password,
        name,
        age: parseInt(age),
        gender,
        user_type: 'CAREGIVER',
      });
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Caregiver Registration
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
        outlineColor="#e0e0e0"
        activeOutlineColor="#1e90ff"
        textColor="black"
        theme={{ roundness: 20 }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        outlineColor="#e0e0e0"
        activeOutlineColor="#1e90ff"
        textColor="black"
        theme={{ roundness: 20 }}
      />

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
        outlineColor="#e0e0e0"
        activeOutlineColor="#1e90ff"
        textColor="black"
        theme={{ roundness: 20 }}
      />

      <TextInput
        label="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
        outlineColor="#e0e0e0"
        activeOutlineColor="#1e90ff"
        textColor="black"
        theme={{ roundness: 20 }}
      />

      <TextInput
        label="Gender (M/F/O)"
        value={gender}
        onChangeText={setGender}
        style={styles.input}
        mode="outlined"
        outlineColor="#e0e0e0"
        activeOutlineColor="#1e90ff"
        textColor="black"
        theme={{ roundness: 20 }}
      />

      <Button 
        mode="contained" 
        onPress={handleRegister}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Register
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    color: 'black',
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
    paddingVertical: 5,
    backgroundColor: '#1a237e',
    elevation: 2,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
