import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import AuthStackScreen from './src/navigation/AuthStack';
import AppStackScreen from './src/navigation/AppStack';
import { UserProvider } from './src/context/UserContext';
import { MedicineProvider } from './src/context/MedicineContext';
import { CaregiverProvider } from './src/context/CaregiverContext';
import { useContext } from 'react';
import { UserContext } from './src/context/UserContext';
import { initFirebaseMessaging } from './src/components/FirebaseMessaging';
import TestScreen from './src/screens/TestScreen';

const Stack = createStackNavigator();

function RootNavigator() {
  const { user } = useContext(UserContext);
console.log(user);
  return (
    <>
      {user ? (
        <Stack.Screen name="App" component={AppStackScreen} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStackScreen} />
      )}
      {/* <Stack.Screen name="Auth" component={AuthStackScreen} /> */}
      </>
  );
}

export default function App() {

  useEffect(() => {
    const init = async () => {
    await initFirebaseMessaging();
    }
    init();
  }, []);
  return (
    <PaperProvider>
    <UserProvider>
      <MedicineProvider>
        <CaregiverProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </CaregiverProvider>
      </MedicineProvider>
    </UserProvider>
  </PaperProvider>
  );
}
