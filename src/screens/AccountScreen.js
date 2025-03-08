import React, { useContext, useState, useEffect } from 'react';
import { Title } from 'react-native-paper';
import { List, Button, IconButton } from 'react-native-paper';
import { UserContext } from '../context/UserContext';
import LinkCaregiverModal from '../components/LinkCaregiverModal';
import { StyleSheet, ScrollView, Alert, View } from 'react-native';
import api from '../services/api';

export default function AccountScreen({ }) {
  const { user, logout } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [caregivers, setCaregivers] = useState([]);

  const handleLogout = () => {
    logout();
  };

  const handleLinkCaregiver = () => {
    setModalVisible(true);
  };

  const handleCaregiverLinked = async (data) => {
    try {
      // Fetch updated caregivers list
      const response = await api.get('/users/caregivers/');
      setCaregivers(response.data);
      Alert.alert('Success', 'Caregiver linked successfully');
    } catch (error) {
      console.error('Error refreshing caregivers:', error);
      Alert.alert('Error', 'Caregiver linked but failed to refresh list');
    }
  };
  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        const response = await api.get('/users/caregivers/');
        setCaregivers(response.data);
      } catch (error) {
        console.error('Error fetching caregivers:', error);
      }
    };
    
    fetchCaregivers();
  }, []);

  // Add the new delete handler here
const handleRemoveCaregiver = (caregiverId) => {
  Alert.alert(
    "Remove Caregiver",
    "Are you sure you want to remove this caregiver?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/users/caregivers/${caregiverId}/`);
            // Refresh caregiver list
            const response = await api.get('/users/caregivers/');
            setCaregivers(response.data);
            Alert.alert('Success', 'Caregiver removed successfully');
          } catch (error) {
            console.error('Error removing caregiver:', error);
            Alert.alert('Error', 'Failed to remove caregiver');
          }
          }
        }
      ]
    );
  };

  // Only show the following allowed fields.
  const allowedFields = ["email", "name", "age", "gender"];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user?.user_type === 'PATIENT' && (
        <>
          <List.Item
            title="Link Caregiver Account"
            description="Connect a caregiver to manage medications"
            left={(props) => <List.Icon {...props} icon="account-heart" />}
            style={styles.linkCaregiverItem}
            titleStyle={styles.linkTitle}
            descriptionStyle={styles.linkDescription}
            onPress={handleLinkCaregiver}
          />

          {caregivers.length > 0 && caregivers.map((caregiver) => (
            <List.Item
              key={caregiver.id}
              title={caregiver.caregiver_email}
              description={`${caregiver.relationship_display} • ${caregiver.permission_level_display}`}
              left={props => <List.Icon {...props} icon="account-heart" />}
              right={props => (
                <IconButton
                  {...props}
                  icon="delete"
                  color="red"
                  onPress={() => handleRemoveCaregiver(caregiver.id)}
                />
              )}
              style={styles.caregiverItem}
            />
          ))}
        </>
      )}

      {user &&
        Object.entries(user)
          .filter(([key]) => allowedFields.includes(key))
          .map(([key, value]) => (
            <List.Item
              key={key}
              title={key.charAt(0).toUpperCase() + key.slice(1)}
              description={value?.toString()}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={
                    key === "email"
                      ? "email"
                      : key === "name"
                      ? "account"
                      : key === "age"
                      ? "numeric"
                      : key === "gender"
                      ? "gender-male-female"
                      : "information"
                  }
                />
              )}
              style={styles.listItem}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
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

      <LinkCaregiverModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSuccess={handleCaregiverLinked}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  linkCaregiverItem: {
    backgroundColor: "#e3f2fd",
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
  },
  linkTitle: {
    color: "#1a237e",
    fontWeight: "600",
  },
  linkDescription: {
    color: "#616161",
    fontSize: 14,
  },
  listItem: {
    backgroundColor: "white",
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
  },
  listTitle: {
    color: "#1a237e",
    fontWeight: "600",
  },
  listDescription: {
    color: "#616161",
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 30,
    borderRadius: 25,
    backgroundColor: "#1a237e",
    elevation: 2,
    paddingVertical: 8,
    marginHorizontal: 16,
  },
  buttonLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  caregiversSection: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: '#1a237e',
  },
  caregiverItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },

});

