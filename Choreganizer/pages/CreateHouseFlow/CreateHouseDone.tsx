import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';

function CreateHouseDone({navigation}: {navigation: any}): React.JSX.Element {
  const [currRoomAddition, onCurrRoomAddition] = useState('');
  const [roomCreated, onRoomCreated] = useState(['']);

  const addUserToInvited = () => {
    onRoomCreated([...roomCreated, currRoomAddition]);
    onCurrRoomAddition('');
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}>
      <ImageBackground
        source={require('../../assets/images/backgroundBlur.png')}
        style={styles.background} // Set a proper style
        resizeMode="cover">
        <View style={styles.inputForm}>
          <Text style={styles.h2}>Create House: Done!</Text>
        </View>
        <Pressable onPress={()=>navigation.navigate('LoggedIn')}><Text>DEV ROUTE: PERSONAL PAGE</Text></Pressable>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  inputForm: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '90%',
  },
  inputText: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#656565',
    borderRadius: 12,
    padding: 15,
  },
  h8: {
    color: '#656565',
    fontSize: 12,
  },
  h6: {
    color: '#656565',
    fontWeight: 'bold',
    fontSize: 16,
  },
  h4: {
    color: '#5A4C9C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  h2: {
    color: '#6D74C9',
    fontWeight: 'bold',
    fontSize: 32,
  },
  buttonPrimary: {
    marginTop: 40,
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
  background: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: '20%',
  },
});

export default CreateHouseDone;
