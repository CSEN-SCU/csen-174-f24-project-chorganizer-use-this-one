import React from 'react';

import './gesture-handler';

import {StyleSheet, Image} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

// Import pages
import Launch from './pages/Launch';
import Personal from './pages/Personal';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import CreateHouseName from './pages/CreateHouseFlow/CreateHouseName';
import CreateHouseMember from './pages/CreateHouseFlow/CreateHouseMember';
import CreateHouseRooms from './pages/CreateHouseFlow/CreateHouseRooms';
import CreateHouseDone from './pages/CreateHouseFlow/CreateHouseDone';
import JoinHouseCode from './pages/JoinHouseCode';
import AuthScreen from './pages/AuthScreen'; 

// Page names
const launchName = 'Launch';
const personalName = 'Personal';
const homeName = 'Home';
const notificationName = 'Notification';
const settingsName = 'Settings';
const createHouseName = 'Create House Name';
const createHouseMembers = 'Create House Members';
const createHouseRooms = 'Create House Rooms';
const createHouseDone = 'Create House Done';
const joinHouseCode = 'Join House Code';
const authName = 'Auth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarStyle: {
    backgroundColor: 'rgba(255,255,255, 0)',
    height: 100,
  },
};

function NavBarStack() {
  return (
    <Tab.Navigator
      screenOptions = {{
        "tabBarShowLabel": false,
        "tabBarLabelStyle": {
          "fontWeight": "bold",
          "fontSize": 12
        },
        "tabBarStyle": [
          {
            "backgroundColor": 'rgba(255,255,255, 0)',
            "height": 100,
            "display": "flex"
          },
          null
        ]
      }}
    >
      <Tab.Screen
        name={personalName}
        component={Personal}
        options={{
          headerShown: false,
          tabBarLabel: 'Personal',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image style={{ width: 50, height: 50 }} source={require('./assets/images/ActivePersonIcon.png')} />
            ) : (
              <Image style={{ width: 30, height: 30 }} source={require('./assets/images/PersonIcon.png')} />
            ),
        }}
      />
      <Tab.Screen
        name={homeName}
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image style={{ width: 50, height: 50 }} source={require('./assets/images/ActiveHomeIcon.png')} />
            ) : (
              <Image style={{ width: 30, height: 30 }} source={require('./assets/images/HomeIcon.png')} />
            ),
        }}
      />
      <Tab.Screen
        name={notificationName}
        component={Notifications}
        options={{
          tabBarLabel: 'Notifications',
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image style={{ width: 50, height: 50 }} source={require('./assets/images/ActiveInboxIcon.png')} />
            ) : (
              <Image style={{ width: 30, height: 30 }} source={require('./assets/images/InboxIcon.png')} />
            ),
        }}
      />
      <Tab.Screen
        name={settingsName}
        component={Settings}
        options={{
          headerShown: false,
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image style={{ width: 50, height: 50 }} source={require('./assets/images/ActiveSettingIcon.png')} />
            ) : (
              <Image style={{ width: 30, height: 30 }} source={require('./assets/images/SettingsIcon.png')} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        {/* Auth screen */}
        <Stack.Screen
          name={authName}
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        {/* Main navigation and other screens */}
        <Stack.Screen
          name="LoggedIn"
          component={NavBarStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={launchName}
          component={Launch}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={createHouseName}
          component={CreateHouseName}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={createHouseMembers}
          component={CreateHouseMember}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={createHouseRooms}
          component={CreateHouseRooms}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={createHouseDone}
          component={CreateHouseDone}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={joinHouseCode}
          component={JoinHouseCode}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
