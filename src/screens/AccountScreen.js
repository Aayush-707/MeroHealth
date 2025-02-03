import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Button } from 'react-native-paper';
import { UserContext } from '../context/UserContext';

export default function AccountScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    // Reset navigation stack to prevent going back
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user && Object.entries(user).map(([key, value]) => (
        key !== 'password' && (
          <List.Item
            key={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            description={value?.toString()}
            left={props => <List.Icon {...props} icon={
              key === 'email' ? 'email' : 
              key === 'name' ? 'account' : 
              'information'
            } />}
            style={styles.listItem}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
        )
      ))}

      <Button 
        mode="contained" 
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={styles.buttonLabel}
        icon="logout"
      >
        Logout
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  listItem: {
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
  },
  listTitle: {
    color: '#1a237e',
    fontWeight: '600',
  },
  listDescription: {
    color: '#616161',
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 30,
    borderRadius: 25,
    backgroundColor: '#1e90ff',
    elevation: 2,
    paddingVertical: 8,
    marginHorizontal: 16,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
