import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Pressable
} from 'react-native';

function JoinHouseCode({ navigation }: { navigation: any }): React.JSX.Element {
  return (
    <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}>
        <ImageBackground source={require('../assets/images/backgroundBlur.png')} style={styles.background} // Set a proper style
        resizeMode="cover" >
            <Text>Create House Page</Text>
            <Pressable style={styles.buttonSecondary} onPress={()=>navigation.navigate('Launch')}>
                <Text style={styles.buttonSecondaryText}>DEV ROUTE: Launch Page</Text>
            </Pressable>
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

export default JoinHouseCode;
