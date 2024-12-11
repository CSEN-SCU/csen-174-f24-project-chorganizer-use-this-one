// AuthScreen.tsx
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SignInUser, SignUpNewUser, swapTimeChecker, assignChorestoHouse, redistributeChores, newSignintoHouseSwapChores} from '../firebase/firebaseConfig';

function AuthScreen(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false); // New state for toggling mode
  const navigation = useNavigation();

  const handleSignIn = async () => {
    // Add authentication logic here for signing in (e.g., Firebase, API call)
    if (email && password) {
      const signedInUser = await SignInUser(email, password);
      if (signedInUser.status === 'existingWithHouseId'){
        navigation.navigate('LoggedIn');
        const houseId= signedInUser.user?.house_id;
        
        //await assignChorestoHouse(houseId);
        //await redistributeChores(houseId);
        //await newSignintoHouseSwapChores(houseId);
        await swapTimeChecker(houseId);
        //console.log("house was swap timne checker-ed!!!!!!");
      } else {
        navigation.navigate('Launch' as never);
      }
    } else {
      Alert.alert('Error', 'Please enter a valid email and password');
    }
  };

  const handleSignUp = () => {
    // Add authentication logic here for signing up (e.g., Firebase, API call)
    if (email && password) {
      SignUpNewUser(email, password, displayName);
      navigation.navigate('Launch' as never);
    } else {
      Alert.alert('Error', 'Please enter a valid email and password');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/backgroundBlur.png')}
        style={styles.background}
        resizeMode="cover">
        <Text style={styles.h2}>
          {isSigningUp ? 'Create Account' : 'Welcome'}
        </Text>
        {isSigningUp && (
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="none"
            textContentType="name"
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
        />

        {/* Conditionally render sign-in or sign-up buttons */}
        {!isSigningUp ? (
          <>
            <Pressable style={styles.buttonPrimary} onPress={handleSignIn}>
              <Text style={styles.buttonPrimaryText}>Sign In</Text>
            </Pressable>
            <Pressable
              style={styles.buttonSecondary}
              onPress={() => setIsSigningUp(true)}>
              <Text style={styles.buttonSecondaryText}>Sign Up</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable style={styles.buttonPrimary} onPress={handleSignUp}>
              <Text style={styles.buttonPrimaryText}>Create Account</Text>
            </Pressable>
            <Pressable
              style={styles.linkButton}
              onPress={() => setIsSigningUp(false)}>
              <Text style={styles.linkText}>
                Already have an account? Sign In
              </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f8fc',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6D74C9',
  },
  input: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    color: '#656565',
    marginBottom: 10,
    padding: 10,
    width: '80%',
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#6D74C9',
    alignItems: 'center',
    marginVertical: 5,
  },
  signUpButton: {
    backgroundColor: '#65558F',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: '#6D74C9',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  buttonPrimary: {
    marginTop: 20,
    backgroundColor: '#6D74C9',
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonPrimaryText: {
    color: '#eee',
    fontSize: 20,
  },
  buttonSecondary: {
    borderBlockColor: '#6D74C9',
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonSecondaryText: {
    color: '#6D74C9',
    fontSize: 20,
  },
  h2: {
    color: '#6D74C9',
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 10,
  },
});

export default AuthScreen;
