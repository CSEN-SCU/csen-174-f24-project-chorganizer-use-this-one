import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';

function CreateHouseDone({navigation}: {navigation: any}): React.JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#6D74C9',
        paddingTop: '20%'
      }}>
      <View style={styles.background}>
        <Pressable style={{alignSelf: 'flex-start'}} onPress={()=>navigation.navigate('LoggedIn')}><Image source={require('../../assets/images/CloseIcon.png')}/></Pressable>
        <View>
          <Image source={require('../../assets/images/ClipBoardGraphic.png')} />
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 20, textAlign: 'center'}}>House Created!</Text>
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 16, textAlign: 'center'}}>You're ready. Let’s begin be seeing what chores we have in store for you.</Text>
        </View>
        <Pressable style={styles.buttonPrimary} onPress={()=>navigation.navigate('LoggedIn')}><Text style={styles.buttonPrimaryText}>Done</Text></Pressable>
      </View>
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
    backgroundColor: '#eee',
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonPrimaryText: {
    color: '#6D74C9',
    fontSize: 20,
  },
  background: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '75%',
    height: '80%'
  },
});

export default CreateHouseDone;
