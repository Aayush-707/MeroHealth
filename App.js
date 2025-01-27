import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import AuthStackScreen from './src/navigation/AuthStack';
import AppStackScreen from './src/navigation/AppStack';
import { UserProvider } from './src/context/UserContext';
import { MedicineProvider } from './src/context/MedicineContext';
import { useContext } from 'react';
import { UserContext } from './src/context/UserContext';

const RootStack = createStackNavigator();

function RootNavigator() {
  const { user } = useContext(UserContext);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="App" component={AppStackScreen} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStackScreen} />
      )}
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <UserProvider>
        <MedicineProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </MedicineProvider>
      </UserProvider>
    </PaperProvider>
  );
}