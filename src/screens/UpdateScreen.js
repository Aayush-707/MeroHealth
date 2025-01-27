import React, { useContext } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, Title } from 'react-native-paper';
import { MedicineContext } from '../context/MedicineContext';

export default function UpdateScreen() {
  const { medicines } = useContext(MedicineContext);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Medication Updates</Title>
      
      <FlatList
        data={medicines}
        keyExtractor={(item, index) => item.id ? item.id.toString() : `fallback-${index}`}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`Instructions: ${item.instructions}\nStatus: ${item.status || 'Pending'}`}
            left={props => <List.Icon {...props} icon="pill" />}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 15 },
});