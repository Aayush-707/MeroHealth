import React from "react";
import { View, Text, Button, Alert } from "react-native";

const TestScreen = () => {
  const handlePress = () => {
    Alert.alert("Button pressed!");
  };

  return (
    <View>
      <Text>Test Screen</Text>
      <Button title="Press me" onPress={handlePress} />
    </View>
  );
}

export default TestScreen;

