import React, { useState } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Pressable
} from 'react-native';

function Launch({ navigation }: { navigation: any }): React.JSX.Element {
  // State to track if user is signed in
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Simulate the Google sign-in process (in the real app, connect to backend)
  const handleGoogleSignIn = () => {
    // For now, we simulate the sign-in process by updating the state
    setIsSignedIn(true);
  };

  return (
    <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}>
        <ImageBackground source={require('../assets/images/backgroundBlur.png')} style={styles.background} // Set a proper style
        resizeMode="cover" >
            <Image
            style={styles.houseGraphic}
            source={require('../assets/images/houseGraphic.png')}
          />
          <Text style={styles.h2}>welcome to</Text>
          <Text style={styles.h1}>Choreganizer!</Text>
          {/* Conditionally render sign-in button or home buttons */}
        {!isSignedIn ? (
          // Google Sign-in Image as a Button
          <Pressable onPress={handleGoogleSignIn}>
            <Image
              source={require('../assets/images/GoogleSignInButton.png')}
              style={styles.googleSignInImage}
            />
          </Pressable>
        ) : (
          // Buttons after sign-in
          <>
              
              <Pressable style={styles.buttonPrimary} onPress={() => navigation.navigate('Create House Name')}>
                <Text style={styles.buttonPrimaryText}>Create a home</Text>
              </Pressable>
              <Pressable style={styles.buttonSecondary} onPress={() => navigation.navigate('Join House Code')}>
                <Text style={styles.buttonSecondaryText}>Join a home</Text>
              </Pressable>
          </>
        )}
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
  googleSignInImage: {
    width: 300,  // Adjust the width as needed
    height: 50,  // Adjust the height as needed (make sure to match the aspect ratio of the image)
    resizeMode: 'contain',  // Ensures the image keeps its aspect ratio
    marginTop: 40,  // Add spacing if needed
  },
  buttonPrimary:{
    marginTop: 40,
    backgroundColor: '#6D74C9',
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20 
  },
  buttonPrimaryText:{
    color: '#eee',
    fontSize: 20
  },
  buttonSecondary:{
    borderBlockColor: '#6D74C9',
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20 
  },
  buttonSecondaryText:{
    color: '#6D74C9',
    fontSize: 20
  }
});

export default Launch;
