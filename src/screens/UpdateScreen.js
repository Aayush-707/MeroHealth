import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import api from '../services/api';

export default function UpdateScreen() {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [medicines, setMedicines] = useState([]);
  const [adherenceHistory, setAdherenceHistory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch adherence history when component mounts
    fetchAdherenceData();
  }, []);

  useEffect(() => {
    // Fetch medicines whenever selected date changes
    fetchMedicinesForDate(selectedDate);
  }, [selectedDate]);

  const fetchAdherenceData = async () => {
    try {
      const response = await api.get('/schedules/adherence-records');
      
      // Process the adherence data for calendar marking
      const markedDates = {};
      
      response.data.forEach(record => {
        // Convert the timestamp to YYYY-MM-DD format
        const date = new Date(record.reminder_details.sent_time).toISOString().split('T')[0];
        
        // Set color based on status
        if (!markedDates[date]) {
          markedDates[date] = { 
            marked: true,
            dotColor: record.status === 'TAKEN' ? '#4CAF50' : 
                     record.status === 'SKIPPED' ? '#F44336' : '#FFC107'
          };
        }
      });
      
      setAdherenceHistory(markedDates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching adherence history:', error);
      setLoading(false);
    }
  };

  const fetchMedicinesForDate = async (date) => {
    try {
      // Get all adherence records
      const response = await api.get('/schedules/adherence-records');
      
      // Filter records for the selected date
      const recordsForDate = response.data.filter(record => {
        const recordDate = new Date(record.reminder_details.sent_time).toISOString().split('T')[0];
        return recordDate === date;
      });
      
      setMedicines(recordsForDate);
    } catch (error) {
      console.error('Error fetching medicines for date:', error);
    }
  };

  const handleStatusUpdate = async (reminderId, newStatus) => {
    try {
      // Update locally first for immediate feedback
      setMedicines(prev => 
        prev.map(med => med.reminder === reminderId ? {...med, status: newStatus} : med)
      );
      
      // Update on server
      if (newStatus === 'TAKEN') {
        await api.post(`/schedules/reminders/${reminderId}/mark-taken/`);
      } else {
        await api.post(`/schedules/reminders/${reminderId}/mark-skipped/`);
      }
      
      // Refresh adherence data
      fetchAdherenceData();
    } catch (error) {
      console.error('Error updating medication status:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Regular calendar - always visible */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...adherenceHistory,
          [selectedDate]: {
            selected: true,
            selectedColor: colors.primary,
            marked: adherenceHistory[selectedDate]?.marked,
            dotColor: adherenceHistory[selectedDate]?.dotColor
          }
        }}
        theme={{
          todayTextColor: colors.accent,
          selectedDayBackgroundColor: colors.primary,
          arrowColor: colors.primary,
        }}
      />

      {/* Legend for color coding */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text>Taken</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
          <Text>Skipped</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
          <Text>Pending</Text>
        </View>
      </View>

      {/* Selected date display */}
      <View style={styles.dateHeader}>
        <Text style={styles.dateHeaderText}>
          Medications for {selectedDate}
        </Text>
      </View>

      {/* Medications list */}
      <FlatList
        data={medicines}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.medicineItem}>
            <View style={styles.medicineInfo}>
              <Text style={styles.medicineName}>
                {item.reminder_details.schedule_details.medication}
              </Text>
              <Text style={styles.medicineTime}>
                {new Date(item.reminder_details.sent_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
              <Text style={styles.dosage}>
                Dosage: {item.reminder_details.schedule_details.dosage}
              </Text>
              <Text style={[styles.medicineStatus, { 
                color: item.status === 'TAKEN' ? '#4CAF50' : 
                       item.status === 'SKIPPED' ? '#F44336' : '#FFC107' 
              }]}>
                Status: {item.status}
              </Text>
              {item.taken_time && (
                <Text style={styles.takenTime}>
                  Taken at: {new Date(item.taken_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
              )}
            </View>
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[
                  styles.statusButton, 
                  styles.takenButton,
                  item.status === 'TAKEN' && styles.disabledButton
                ]}
                onPress={() => handleStatusUpdate(item.reminder, 'TAKEN')}
                disabled={item.status === 'TAKEN'}
              >
                <MaterialIcons name="check" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton, 
                  styles.notTakenButton,
                  item.status === 'SKIPPED' && styles.disabledButton
                ]}
                onPress={() => handleStatusUpdate(item.reminder, 'SKIPPED')}
                disabled={item.status === 'SKIPPED'}
              >
                <MaterialIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No medications for this date</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  dateHeader: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  medicineTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dosage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  medicineStatus: {
    fontSize: 14,
    marginBottom: 4,
  },
  takenTime: {
    fontSize: 14,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  statusButtons: {
    flexDirection: 'row',
  },
  statusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  takenButton: {
    backgroundColor: '#4CAF50',
  },
  notTakenButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
