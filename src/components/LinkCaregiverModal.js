import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

const LinkCaregiverModal = ({ visible, onDismiss, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('FAMILY');
  const [permissionLevel, setPermissionLevel] = useState('VIEW');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await api.post('/users/caregivers/add/', {
        caregiver_email: email,
        relationship: relationship,
        permission_level: permissionLevel,
        emergency_contact: false
      });
      
      onSuccess(response.data);
      onDismiss();
      setEmail('');
    } catch (error) {
      console.error('Error linking caregiver:', error);
      Alert.alert('Error', 'Failed to link caregiver. Please verify the email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} onDismiss={onDismiss} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Title style={styles.title}>Link Caregiver</Title>
          
          <TextInput
            label="Caregiver's Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={relationship}
              onValueChange={setRelationship}
              style={styles.picker}
            >
              <Picker.Item label="Family Member" value="FAMILY" />
              <Picker.Item label="Doctor" value="DOCTOR" />
              <Picker.Item label="Nurse" value="NURSE" />
              <Picker.Item label="Professional Caretaker" value="CARETAKER" />
              <Picker.Item label="Other" value="OTHER" />
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={permissionLevel}
              onValueChange={setPermissionLevel}
              style={styles.picker}
            >
              <Picker.Item label="View Only" value="VIEW" />
              <Picker.Item label="Manage Medications" value="MANAGE" />
              <Picker.Item label="Full Access" value="FULL" />
            </Picker>
          </View>

          <Button 
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            style={styles.button}
          >
            Link Caregiver
          </Button>
          
          <Button 
            mode="text"
            onPress={onDismiss}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
  },
  cancelButton: {
    marginTop: 10,
  },
});

export default LinkCaregiverModal;
