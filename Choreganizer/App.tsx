import React from 'react';

import './gesture-handler';

import {
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';


//pages
import Launch from './pages/Launch';
import Personal from './pages/Personal';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import CreateHouseName from './pages/CreateHouseFlow/CreateHouseName';
import CreateHouseMember from './pages/CreateHouseFlow/CreateHouseMember';
import CreateHouseRooms from './pages/CreateHouseFlow/CreateHouseRooms';
import CreateHouseDone from './pages/CreateHouseFlow/CreateHouseDone';

//page names
const launchName = "Launch";
const personalName = "Personal";
const homeName = "Home";
const notificationName = "Notification";
const settingsName = "Settings";
const createHouseName = "Create House Name";
const createHouseMembers = "Create House Members"
const createHouseRooms = "Create House Rooms";
const createHouseDone = "Create House Done";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function NavBarStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={personalName} component={Personal} options={{ headerShown: false }}/>
      <Tab.Screen name={homeName} component={Home} options={{ headerShown: false }}/>
      <Tab.Screen name={notificationName} component={Notifications} options={{ headerShown: false }}/>
      <Tab.Screen name={settingsName} component={Settings} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoggedIn" component={NavBarStack} options={{ headerShown: false }}/>
        <Stack.Screen name={launchName} component={Launch} options={{ headerShown: false }}/>
        <Stack.Screen name={createHouseName} component={CreateHouseName} options={{ headerShown: false }}/>
        <Stack.Screen name={createHouseMembers} component={CreateHouseMember} options={{ headerShown: false }}/>
        <Stack.Screen name={createHouseRooms} component={CreateHouseRooms} options={{ headerShown: false }}/>
        <Stack.Screen name={createHouseDone} component={CreateHouseDone} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
