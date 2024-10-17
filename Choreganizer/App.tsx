/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
//import backgroundImage from "./images/backgroundBlur.png";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ImageBackground,
  Image,
  Button
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ImageBackground source={require('./assets/images/backgroundBlur.png')} style={styles.background} // Set a proper style
        resizeMode="cover" >
          <Image
            style={styles.houseGraphic}
            source={require('./assets/images/houseGraphic.png')}
          />
          <Text style={styles.h2}>welcome to</Text>
          <Text style={styles.h1}>Choreganizer!</Text>
          <Button
            onPress={()=>console.log("hello world!")}
            title="Create a home"
            color='#6D74C9'
          />
          <Button
            onPress={()=>console.log("hello world!")}
            title="Join a home"
            accessibilityLabel="Learn more about this purple button"
            color='#000'
          />
        </ImageBackground>
      </View>
  );
}

const styles = StyleSheet.create({
   background: {
    flex: 1, 
    justifyContent: 'center',  
    alignItems: 'center',
    width: '100%' 
  },
  houseGraphic: {
    width: 300,
    height: 300,  // Add a height here to avoid cropping
    resizeMode: 'contain', // Use contain to keep the aspect ratio
  },
  h1: {
    color: '#5A4C9C',
    fontWeight: 'bold',
    fontSize: 48
  },
  h2: {
    color: '#6D74C9',
    fontWeight: 'bold',
    fontSize: 32
  },
  buttonPrimary:{
    color: '#6D74C9'
  },
  buttonSecondary:{

  },
});

export default App;
