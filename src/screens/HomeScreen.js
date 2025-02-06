import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';
import { MedicineContext } from '../context/MedicineContext';
import { UserContext } from '../context/UserContext';

export default function HomeScreen({ navigation }) {
  const { medicines } = useContext(MedicineContext);
  const { role } = useContext(UserContext);
  
  return (
    <View style={styles.container}>
      {medicines.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No medications scheduled</Text>
        </View>
      ) : (
        <FlatList
          data={medicines}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : `fallback-${index}`
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.medicineTitle}>{item.name}</Title>

                <View style={styles.detailRow}>
                  <Paragraph style={styles.detailLabel}>Dosage:</Paragraph>
                  <Paragraph style={styles.detailValue}>
                    {item.dosage}
                  </Paragraph>
                </View>

                <View style={styles.detailRow}>
                  <Paragraph style={styles.detailLabel}>Frequency:</Paragraph>
                  <Paragraph style={styles.detailValue}>
                    {item.frequency}
                  </Paragraph>
                </View>

                <View style={styles.detailRow}>
                  <Paragraph style={styles.detailValue}>
                    {item.time
                      ? new 
                      Date(item.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No time available"}
                  </Paragraph>
                </View>

                {item.instructions && (
                  <Paragraph style={styles.instructions}>
                    Instructions: {item.instructions}
                  </Paragraph>
                )}
              </Card.Content>
            </Card>
          )}
        />
      )}

      {role === "PATIENT" && (
        <FAB
          style={styles.fab}
          icon="plus"
          color="white"
          onPress={() => navigation.navigate("AddMedicine")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  medicineTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'baseline',
  },
  detailLabel: {
    fontSize: 14,
    color: '#616161',
    width: 90,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#212121',
    flex: 1,
  },
  instructions: {
    marginTop: 12,
    fontSize: 13,
    color: '#616161',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
    backgroundColor: '#1e90ff',
    borderRadius: 28,
    elevation: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#616161',
    fontStyle: 'italic',
  },
});
