import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  FlatList,
  Pressable,
  Image
} from 'react-native';
import { inviteUserToHouse } from '../../firebase/firebaseConfig';
import { house } from './CreateHouseName';

function CreateHouseMember({navigation}: {navigation: any}): React.JSX.Element {
  const [currUserAddition, onCurrUserAddition] = useState('');
  const [userSignedUp, onUserSignUp] = useState([]);

  const userProfileColors = [
    '#FFE3E3',
    '#FBF0E2',
    '#E6FEF1',
    '#DCDDFF',
    '#FBDDFC',
  ];

  const addUserToInvited = () => {
    onUserSignUp([...userSignedUp, currUserAddition]);
    onCurrUserAddition('');
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
        <View style={{width: '80%', display: 'flex', alignItems: 'center'}}>
          {/* Back button and header */}
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 40,
              gap: 10,
            }}>
            {/* Back button */}
            <Pressable
              style={{alignSelf: 'flex-start', marginBottom: 20}}
              onPress={() => navigation.navigate('Create House Name')}>
              <Image source={require('../../assets/images/BackButton.png')}/>
            </Pressable>

            {/* Header */}
            <Text style={styles.h2}>Invite your housemates</Text>
            <Text style={styles.h6}>
              Provide the email of the person you’re inviting. We’ll email them
              a house code.{' '}
            </Text>
          </View>

          {/* Input Email Section */}
          <View style={{marginBottom: 20, marginTop: 30}}>
            <Text style={[styles.h8, {marginBottom: 5}]}>Invite Email</Text>
            {/* TextInput Form and Submission Button */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 5,
              }}>
              <TextInput
                style={styles.nameInput}
                placeholder="Enter email here"
                onChangeText={onCurrUserAddition}
                value={currUserAddition}
              />
              <Pressable
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: '#6D74C9',
                }}
                onPress={addUserToInvited}>
                <Text style={{fontSize: 16, color: 'white'}}>Send Invite</Text>
              </Pressable>
            </View>
          </View>

          {/* Email list section */}
          <FlatList
            data={userSignedUp}
            renderItem={({item, index}) => (
              <View style={styles.userEmailed}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 5,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor:
                        userProfileColors[index % userProfileColors.length],
                      borderRadius: 100,
                      width: 40,
                      height: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 16, color: 'rgba(0,0,0, 0.5)'}}>
                      {item[0]}
                    </Text>
                  </View>
                  <Text style={{fontSize: 16, color: '#656565'}}>{item}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 5,
                    paddingHorizontal: 8,
                    paddingVertical: 5,
                  }}>
                  <Text style={{fontSize: 12}}>Invite Sent</Text>
                </View>
              </View>
            )}
          />

          <Pressable
            style={styles.buttonPrimary}
            onPress={() => {
              inviteUserToHouse(house.id, userSignedUp); //HI BACKEND PEOPLE! here's where you could maybe maybe submit the list of housemates which is called "userSignedUp"
              navigation.navigate('Create House Rooms');
            }}>
            <Text style={styles.buttonPrimaryText}>Continue</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  userEmailed: {
    backgroundColor: '#F3F5F6',
    width: '100%',
    marginVertical: 5,
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  nameInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'lightgrey',
    color: '#656565',
    padding: 10,
    width: '70%',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  inputForm: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '70%',
    gap: 10,
    marginTop: 10,
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
    fontWeight: 'bold',
  },
  h6: {
    color: '#6D74C9',
    fontSize: 16,
    textAlign: 'center',
  },
  h4: {
    color: '#5A4C9C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  h2: {
    color: '#6D74C9',
    fontWeight: 'bold',
    fontSize: 28,
    width: '100%',
    textAlign: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#6D74C9',
    width: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonPrimaryText: {
    color: '#eee',
    fontSize: 20,
  },
  background: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: '20%',
  },
});

export default CreateHouseMember;
