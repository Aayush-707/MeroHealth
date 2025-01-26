// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStackScreen from './src/navigation/AuthStack';
import AppStackScreen from './src/navigation/AppStack';
import { UserProvider } from './src/context/UserContext';
import { MedicineProvider } from './src/context/MedicineContext';
import { useContext } from 'react'; // Add this
import { UserContext } from './src/context/UserContext'; // Add this

const RootStack = createStackNavigator();

function RootNavigator() { // New component
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
    <UserProvider>
      <MedicineProvider>
        <NavigationContainer>
          <RootNavigator /> {/* Replace the old navigator with this */}
        </NavigationContainer>
      </MedicineProvider>
    </UserProvider>
  );
}