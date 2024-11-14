import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  FlatList,
  Pressable,
  Image,
} from 'react-native';

import {createHouse} from '../../functions/src/index.js';

createHouse("test1", 4);

function CreateHouseName({navigation}: {navigation: any}): React.JSX.Element {
  const [houseName, onChangeHouseName] = useState('');

  const submitUserHouseName = () => {
    //HI BACKEND PEOPLE! this is where you submit the house name 🫀
    console.log('submitting user info');
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
        <View style={{width: '80%'}}>
          {/* Back button and header */}
          <View style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40, gap: 20}}>
            {/* Back button */}
            <Pressable
              style={{alignSelf: 'flex-start'}}
              onPress={() => navigation.navigate('Launch')}>
              <Image source={require('../../assets/images/BackButton.png')}/>
            </Pressable>

            {/* Header */}
            <Text style={styles.h2}>Name Your House</Text>
          </View>

          {/* Form section */}
          <View style={styles.inputForm}>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter house name"
              onChangeText={onChangeHouseName}
              onSubmitEditing={submitUserHouseName}
              value={houseName}
            />
            <Pressable
              style={styles.buttonPrimary}
              onPress={() => navigation.navigate('Create House Members')}>
              <Text style={styles.buttonPrimaryText}>
                {houseName.length > 0 ? 'Continue' : 'Skip'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  inputForm: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '70%',
    gap: 10
  },
  nameInput: {
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    color: '#656565',
    marginBottom: 15,
    padding: 10,
    width: '70%',
    textAlign: 'center',
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

export default CreateHouseName;
