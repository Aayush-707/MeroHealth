import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import PatientRegisterScreen from '../screens/PatientRegisterScreen';
import CaregiverRegisterScreen from '../screens/CaregiverRegisterScreen';

const Stack = createStackNavigator();

export default function AuthStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="PatientRegister" component={PatientRegisterScreen} />
      <Stack.Screen name="CaregiverRegister" component={CaregiverRegisterScreen} />
    </Stack.Navigator>
  );
}