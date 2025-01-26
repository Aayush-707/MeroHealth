import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';
import { MedicineContext } from '../context/MedicineContext';
import { UserContext } from '../context/UserContext';

export default function HomeScreen({ navigation }) {
  const { medicines } = useContext(MedicineContext);
  const { role } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.name}</Title>
              <Paragraph>Dosage: {item.dosage}</Paragraph>
              <Paragraph>Frequency: {item.frequency}</Paragraph>
              <Paragraph>Time: {item.time?.toLocaleTimeString?.() || 'Invalid time'}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />

      {role === 'Patient' && (
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('AddMedicine')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { marginVertical: 5 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});