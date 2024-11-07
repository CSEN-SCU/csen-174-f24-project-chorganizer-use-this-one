import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ImageBackground, Keyboard } from 'react-native';

function JoinHouseCode({ navigation }: { navigation: any }): React.JSX.Element {
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleInputChange = (text: string, index: number) => {
    // Ensure the text is a number and update the code array
    const isNumeric = /^[0-9]$/.test(text); // Check if the input is a single digit number
    if (isNumeric || text === '') {
      const updatedCode = [...code];
      updatedCode[index] = text;
      setCode(updatedCode);

      // Automatically move focus to the next input if the current input is a number
      if (text !== '' && index < code.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  useEffect(() => {
    // Automatically focus on the first input when the component mounts
    setTimeout(() => {
      inputRefs.current[0]?.focus(); // Adding a timeout to ensure the layout is ready
    }, 100);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/backgroundBlur.png')}
        style={styles.background}
        resizeMode="cover">
        <View style={{ width: '80%' }}>
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.navigate('Launch')}>
              <Text>◀️</Text>
            </Pressable>
            <Text style={styles.h2}>Let's join your house</Text>
            <Text style={styles.h4}>We sent a code to your email</Text>
          </View>

          <View style={styles.inputForm}>
            <View style={styles.codeInputContainer}>
              {code.map((value, index) => (
                <TextInput
                  key={index}
                  style={styles.codeInputBox}
                  value={value}
                  onChangeText={(text) => handleInputChange(text, index)}
                  maxLength={1}
                  keyboardType="numeric"
                  ref={(el) => (inputRefs.current[index] = el)} // Reference each input
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace' && value === '') {
                      // Move focus to the previous box when backspace is pressed
                      if (index > 0) {
                        inputRefs.current[index - 1]?.focus();
                      }
                    }
                  }}
                />
              ))}
            </View>

            <Pressable
              style={styles.buttonPrimary}
              onPress={() => navigation.navigate('LoggedIn')}>
              <Text style={styles.buttonPrimaryText}>Join House</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  background: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: '20%',
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 40,
    gap: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  h2: {
    color: '#6D74C9',
    fontWeight: 'bold',
    fontSize: 32,
  },
  h4: {
    color: '#5A4C9C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputForm: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '70%',
    gap: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    gap: 15,
  },
  codeInputBox: {
    width: 60,
    height: 60,
    backgroundColor: '#EEECF0',
    borderRadius: 15,
    fontSize: 48, // Font size 1.5 times the header size
    textAlign: 'center',
    color: '#000', // Make the number black
    borderWidth: 1,
    borderColor: '#D1D1D1',
  },
  buttonPrimary: {
    backgroundColor: '#6D74C9',
    width: '70%',
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
});

export default JoinHouseCode;123
