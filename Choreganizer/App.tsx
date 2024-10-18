import React from 'react';

import {
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


//pages
import Launch from './pages/Launch';
import Personal from './pages/Personal';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

//page names
const launchName = "Launch";
const personalName = "Personal";
const homeName = "Home";
const notificationName = "Notification";
const settingsName = "Settings";


const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
        <Tab.Navigator initialRouteName='Launch'>
          <Tab.Screen name={launchName} component={Launch} options={{ headerShown: false }}/>
          <Tab.Screen name={personalName} component={Personal} options={{ headerShown: false }}/>
          <Tab.Screen name={homeName} component={Home} options={{ headerShown: false }}/>
          <Tab.Screen name={notificationName} component={Notifications} options={{ headerShown: false }}/>
          <Tab.Screen name={settingsName} component={Settings} options={{ headerShown: false }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
