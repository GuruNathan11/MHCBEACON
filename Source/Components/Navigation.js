import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from "../Screen/MainScreen";
import DeviceScreen from "../Screen/DeviceScreen";
import ScanScreen from "../Screen/ScanScreen";
import EmergencyScreen from "../Screen/EmergencyScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MHC" component={MainScreen}  />
        <Stack.Screen name="Device" component={DeviceScreen}  />
        <Stack.Screen name="Scan" component={ScanScreen}  />
        <Stack.Screen name="Emergency" component={EmergencyScreen}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
