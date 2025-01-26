import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Title } from 'react-native-paper';
import { UserContext } from '../context/UserContext';

export default function AccountScreen() {
  const { user } = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Account Details</Title>
      
      {user && Object.entries(user).map(([key, value]) => (
        key !== 'password' && (
          <List.Item
            key={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            description={value?.toString()}
            left={props => <List.Icon {...props} icon="information" />}
          />
        )
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 15 },
});