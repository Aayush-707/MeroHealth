import React, { useContext, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { MedicineContext } from '../context/MedicineContext';
import { Calendar } from 'react-native-calendars';

const CollapsibleCalendar = ({ selectedDate, setSelectedDate, colors }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleCalendar = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const calendarHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 350],
  });

  return (
    <Animated.View style={[styles.calendarContainer, { height: calendarHeight }]}>
      <TouchableOpacity onPress={toggleCalendar} style={styles.calendarHeader}>
        <Text style={styles.dateText}>{selectedDate}</Text>
        <IconButton
          icon={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          onPress={toggleCalendar}
        />
      </TouchableOpacity>
      {isExpanded && (
        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            toggleCalendar();
          }}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: colors.primary }
          }}
          theme={{
            todayTextColor: colors.accent,
            selectedDayBackgroundColor: colors.primary,
            arrowColor: colors.primary,
          }}
        />
      )}
    </Animated.View>
  );
};

export default function UpdateScreen() {
  const { medicines, updateMedicineStatus } = useContext(MedicineContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { colors } = useTheme();

  const handleStatusUpdate = (id, newStatus) => {
    updateMedicineStatus(id, newStatus);
  };

  return (
    <View style={styles.container}>
      <CollapsibleCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        colors={colors}
      />
      <FlatList
        data={medicines}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item, index) => item.id ? item.id.toString() : `fallback-${index}`}
        renderItem={({ item }) => (
          <View style={styles.medicineItem}>
            <View style={styles.medicineInfo}>
              <Text style={styles.medicineName}>{item.name}</Text>
              <Text style={[styles.medicineStatus, { color: item.status === 'Taken' ? colors.success : colors.error }]}>
                {item.status || 'Pending'}
              </Text>
            </View>
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[styles.statusButton, styles.takenButton]}
                onPress={() => handleStatusUpdate(item.id, 'Taken')}
              >
                <MaterialIcons name="check" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statusButton, styles.notTakenButton]}
                onPress={() => handleStatusUpdate(item.id, 'Not Taken')}
              >
                <MaterialIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  calendarContainer: {
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
  },
  dateText: {
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
  medicineStatus: {
    fontSize: 14,
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
});
