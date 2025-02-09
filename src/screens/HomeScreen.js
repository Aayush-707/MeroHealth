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
              <Card.Content style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Title style={styles.medicineTitle}>
                    {item.medication_details?.name || 'Unknown Medicine'}
                  </Title>
                  {item.medication_details?.instructions && (
                    <Paragraph style={styles.instructions}>
                      Instructions: {item.medication_details.instructions}
                    </Paragraph>
                  )}
                </View>
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
    elevation: 3,
    backgroundColor: "white",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  medicineTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "black",
    marginBottom: 6,
  },
  instructions: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    margin: 24,
    right: 0,
    bottom: 0,
    backgroundColor: "#1a237e",
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
