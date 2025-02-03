import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { MedicineContext } from '../context/MedicineContext';

export default function UpdateScreen() {
  const { medicines } = useContext(MedicineContext);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <FlatList
        data={medicines}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item, index) => item.id ? item.id.toString() : `fallback-${index}`}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <MaterialIcons name="medical-services" size={24} color="#1e90ff" />
                <Title style={styles.medicineTitle}>{item.name}</Title>
              </View>

              <View style={styles.detailRow}>
                <Paragraph style={styles.detailLabel}>Status:</Paragraph>
                <Paragraph style={[styles.detailValue, { color: item.status === 'Taken' ? '#4CAF50' : '#F44336' }]}>
                  {item.status || 'Pending'}
                </Paragraph>
              </View>

              <View style={styles.detailRow}>
                <Paragraph style={styles.detailLabel}>Instructions:</Paragraph>
                <Paragraph style={styles.instructions}>
                  {item.instructions}
                </Paragraph>
              </View>

              <View style={styles.timeRow}>
                <MaterialIcons name="access-time" size={16} color="#616161" />
                <Paragraph style={styles.timeText}>
                  {item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 20,
    marginLeft: 60,
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    color: '#616161',
    width: 100,
    fontWeight: '500',
  },
  instructions: {
    fontSize: 14,
    color: '#212121',
    flex: 1,
    lineHeight: 20,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  timeText: {
    fontSize: 13,
    color: '#616161',
    marginLeft: 4,
  },
});
