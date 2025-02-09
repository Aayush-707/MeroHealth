import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import UpdateScreen from '../screens/UpdateScreen';
import AccountScreen from '../screens/AccountScreen';
import AddMedicineScreen from '../screens/AddMedicineScreen';
import MedicationDetailScreen from '../screens/MedicationDetailScreen'
import EditMedicineScreen from '../screens/EditMedicineScreen';


const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const UpdateStack = createStackNavigator();
const AccountStack = createStackNavigator();

const headerStyle = {
  headerStyle: {
    backgroundColor: '#1a237e',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: '600',
    fontSize: 20,
  },
  headerTitleAlign: 'center',
};

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={headerStyle}>
      <HomeStack.Screen
        name="Main"
        component={HomeScreen}
        options={{ 
          title: 'MeroHealth',
          headerLeft: () => null
        }}
      />
      <HomeStack.Screen
        name="AddMedicine"
        component={AddMedicineScreen}
        options={{ 
          title: 'Add Medicine',
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <MaterialIcons 
              name="chevron-left" 
              size={28} 
              color="#fff" 
              style={{ 
                marginLeft: 14,
                backgroundColor: '#ffffff20',
                borderRadius: 20,
                padding: 4,
              }}
            />
          )
        }}
      />
      <HomeStack.Screen
        name="MedicationDetail"
        component={MedicationDetailScreen}
        options={{ title: 'Medication Details' }}
      />

      <HomeStack.Screen
        name="EditMedicine"
        component={EditMedicineScreen}
        options={{ 
          title: 'Edit Medicine',
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <MaterialIcons 
              name="chevron-left" 
              size={28} 
              color="#fff" 
              style={{ 
                marginLeft: 14,
                backgroundColor: '#ffffff20',
                borderRadius: 20,
                padding: 4,
              }}
            />
          )
        }}
      />
    </HomeStack.Navigator>
  );
}

function UpdateStackScreen() {
  return (
    <UpdateStack.Navigator screenOptions={headerStyle}>
      <UpdateStack.Screen
        name="UpdatesMain"
        component={UpdateScreen}
        options={{ 
          title: 'Medication Updates',
          headerLeft: () => null
        }}
      />
    </UpdateStack.Navigator>
  );
}

function AccountStackScreen() {
  return (
    <AccountStack.Navigator screenOptions={headerStyle}>
      <AccountStack.Screen
        name="AccountMain"
        component={AccountScreen}
        options={{ 
          title: 'Account Details',
          headerLeft: () => null
        }}
      />
    </AccountStack.Navigator>
  );
}

export default function AppStackScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          const icons = {
            Home: 'home',
            Update: 'update',
            Account: 'person',
          };
          return (
            <MaterialIcons 
              name={icons[route.name]} 
              size={24} 
              color={color} 
            />
          );
        },
        tabBarActiveTintColor: '#1a237e',
        tabBarInactiveTintColor: '#616161',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 70,
          paddingBottom: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 6,
          marginVertical: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Update" 
        component={UpdateStackScreen} 
        options={{ title: 'Updates' }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountStackScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
