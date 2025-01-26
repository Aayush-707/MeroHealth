import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import UpdateScreen from '../screens/UpdateScreen';
import AccountScreen from '../screens/AccountScreen';
import AddMedicineScreen from '../screens/AddMedicineScreen';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="AddMedicine" component={AddMedicineScreen} />
    </HomeStack.Navigator>
  );
}

export default function AppStackScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Update: 'update',
            Account: 'person',
          };
          return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Main" component={HomeStackScreen} />
      <Tab.Screen name="Update" component={UpdateScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}