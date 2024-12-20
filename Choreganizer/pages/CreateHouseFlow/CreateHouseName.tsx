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

import { createHouse } from '../../firebase/firebaseConfig';

let house: any;

function CreateHouseName({navigation}: {navigation: any}): React.JSX.Element {
  const [houseName, onChangeHouseName] = useState('');
  // const submitUserHouseName = () => {
  //   const houseSnap = createHouse(houseName);
  //   console.log("1", houseSnap);
  //   const house = houseSnap.data();
  //   // console.log("HELLO!", house);
  //   // console.log('submitting house info');
  // };

  const submitUserHouseName = async () => {
    try {
      house = await createHouse(houseName); // Wait for the promise to resolve
      //console.log('1', houseSnap);

      //house = houseSnap?.data(); // Update the global `house` variable
      console.log('House Data:', house); // Debugging
    } catch (error) {
      console.error('Error creating house:', error);
    }
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
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 40,
              gap: 20,
            }}>
            {/* Back button */}
            <Pressable
              style={{alignSelf: 'flex-start'}}
              onPress={() => navigation.navigate('Launch')}>
              <Image source={require('../../assets/images/BackButton.png')} />
            </Pressable>

            {/* Header */}
            <Text style={styles.h2}>Name Your House</Text>
          </View>

          {/* Form section */}
          <View style={styles.inputForm}>
            <TextInput
              style={styles.nameInput}
              placeholder=""
              onChangeText={onChangeHouseName}
              onSubmitEditing={submitUserHouseName}
              value={houseName}
              multiline={false}
            />
            <Pressable
              style={styles.buttonPrimary}
              onPress={async () => {
                await submitUserHouseName();
                navigation.navigate('Create House Members');
              }}>
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
    gap: 10,
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

export { house };

export default CreateHouseName;
