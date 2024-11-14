// AuthScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function AuthScreen(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false); // New state for toggling mode
  const navigation = useNavigation();

  const handleSignIn = () => {
    // Add authentication logic here for signing in (e.g., Firebase, API call)
    if (email && password) {
      // Simulate successful login
      navigation.navigate('Launch' as never);
    } else {
      Alert.alert('Error', 'Please enter a valid email and password');
    }
  };

  const handleSignUp = () => {
    // Add authentication logic here for signing up (e.g., Firebase, API call)
    if (email && password) {
      // Simulate successful signup
      navigation.navigate('Launch' as never);
    } else {
      Alert.alert('Error', 'Please enter a valid email and password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSigningUp ? 'Create Account' : 'Welcome'}</Text>
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
          <Pressable style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.signUpButton]}
            onPress={() => setIsSigningUp(true)}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable style={[styles.button, styles.signUpButton]} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>
          <Pressable
            style={styles.linkButton}
            onPress={() => setIsSigningUp(false)}
          >
            <Text style={styles.linkText}>Already have an account? Sign In</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: '80%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
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
});

export default AuthScreen;
