import React, { useContext, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { FAB, Card, Title, Paragraph, Button } from 'react-native-paper';
import { MedicineContext } from '../context/MedicineContext';
import { UserContext } from '../context/UserContext';
import api from '../services/api';

export default function HomeScreen({ navigation }) {
  const { medicines, refreshMedicines } = useContext(MedicineContext);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        setIsLoading(true);
        if (user?.user_type === 'CAREGIVER') {
          try {
            const response = await api.get('/users/caregiver/dashboard/');
            setPatients(response.data);
          } catch (error) {
            console.error('Error fetching patients:', error);
          }
        } else {
          await refreshMedicines();
        }
        setIsLoading(false);
      };
      loadData();
    }, [user?.user_type])
  );

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Caregiver View
  if (user?.user_type === 'CAREGIVER') {
    return (
      <View style={styles.container}>
        <Title style={styles.pageTitle}>My Patients</Title>
        {patients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No patients assigned</Text>
          </View>
        ) : (
          <FlatList
            data={patients}
            keyExtractor={(item) => item.patient_id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content>
                  <Title style={styles.medicineTitle}>{item.patient_name}</Title>
                  {/* Add Email and Relationship Paragraphs here */}
                  <Paragraph style={styles.darkText}>
                    Email: {item.patient_email}
                  </Paragraph>
                  <Paragraph style={styles.darkText}>
                    Relationship: {item.relationship}
                  </Paragraph>
                  {item.can_view_adherence && (
                    <Button 
                      mode="contained" 
                      style={styles.viewButton}
                      labelStyle={styles.viewButtonText}
                      onPress={() => navigation.navigate('PatientMedications', { 
                        patientId: item.patient_id 
                      })}
                    >
                      View Medications
                    </Button>
                  )}
                </Card.Content>
              </Card>
            )}
          />
        )}
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
      {user?.user_type === "PATIENT" && (
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
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    padding: 16,
    color: '#1a237e',
  },
  viewButton: {
    marginTop: 10,
    backgroundColor: '#1a237e',
  },
  viewButtonText: {
    color: 'white',
  },
  darkText: {
    fontSize: 16,
    color: "black",
    fontWeight: "600",
  },
});
