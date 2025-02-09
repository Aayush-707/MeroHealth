import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button, TextInput, Text, Title } from 'react-native-paper';
import { UserContext } from '../context/UserContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(UserContext);

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      // Reset navigation stack and move to App stack
    } else {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>MeroHealth</Title>
        <Text style={styles.subtitle}>Your Personalized Health Companion</Text>
      </View>

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
        theme={{ roundness: 20 }} // Text color changed to black
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
        theme={{ roundness: 20 }} // Text color changed to black
      />

      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Login
      </Button>

      <View style={styles.registerContainer}>
        <Text style={styles.registerTextLabel}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')}>
          <Text style={styles.registerText}>Register here</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    marginBottom: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
    color: '#1a237e',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
    paddingVertical: 5,
    elevation: 2,
    backgroundColor: '#1a237e', // Changed button color
  },
  buttonLabel: {
    color: 'white', // Ensuring the text remains readable
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  registerTextLabel: {
    color: 'black', // Changed "Don't have an account?" text color to black
  },
  registerText: {
    color: '#1e90ff',
    fontWeight: '600',
  },
});
