import React, { useContext, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';
import { MedicineContext } from '../context/MedicineContext';
import { UserContext } from '../context/UserContext';

export default function HomeScreen({ navigation }) {
  const { medicines, refreshMedicines } = useContext(MedicineContext);
  const { role } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  //effect to refresh medicines when screen comes to focus
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        setIsLoading(true);
        await refreshMedicines();
        setIsLoading(false);
      };
      loadData();
    }, []) 
  );
  


  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Loading medications...</Text>
      </View>
    );
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'No time set';
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch (error) {
      return timeString;
    }
  };
  
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
            <Card
              style={styles.card}
              onPress={() =>
                navigation.navigate("MedicationDetail", { medicationId: item.id })
              }
            >
              <Card.Content>
                <Title style={styles.medicineTitle}>
                  {item.medication_details?.name || 'Unknown Medicine'}
                </Title>
                {item.medication_details?.instructions && (
                  <Paragraph style={styles.instructions}>
                    Instructions: {item.medication_details.instructions}
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
    backgroundColor: "#f8f9fa",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "white",
  },
  medicineTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a237e",
    marginBottom: 12,
  },
  instructions: {
    fontSize: 14,
    color: "#212121",
  },
  fab: {
    position: "absolute",
    margin: 24,
    right: 0,
    bottom: 0,
    backgroundColor: "#1e90ff",
    borderRadius: 28,
    elevation: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#616161",
    fontStyle: "italic",
  },
});
