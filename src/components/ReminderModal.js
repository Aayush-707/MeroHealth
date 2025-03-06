import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

const ReminderModal = ({ visible, onClose, onTake, reminder }) => {
  if (!reminder) return null;
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Medication Reminder</Text>
          
          <Text style={styles.medicationName}>
            {reminder.schedule_details?.medication || 'Your medication'}
          </Text>
          
          <Text style={styles.dosageText}>
            Dosage: {reminder.schedule_details?.dosage || ''}
          </Text>
          
          <Text style={styles.timeText}>
            Time: {new Date(reminder.sent_time).toLocaleTimeString()}
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              onPress={onTake} 
              style={styles.takeButton}
            >
              Take Now
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={onClose} 
              style={styles.skipButton}
            >
              Skip
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a237e',
  },
  medicationName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  dosageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  timeText: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  takeButton: {
    backgroundColor: '#1a237e',
    flex: 1,
    marginRight: 5,
  },
  skipButton: {
    borderColor: '#1a237e',
    flex: 1,
    marginLeft: 5,
  },
});

export default ReminderModal;
