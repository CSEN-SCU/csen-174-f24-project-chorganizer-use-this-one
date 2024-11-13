import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
  Switch,
  Modal,
  TextInput
} from 'react-native';

function Settings({navigation}: {navigation: any}): React.JSX.Element {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [modalVisible, setModalVisible] = useState(false);
  const [houseCode, onChangeHouseCode] = React.useState('');


  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}>
      <ImageBackground
        source={require('../assets/images/backgroundBlur.png')}
        style={styles.background} // Set a proper style
        resizeMode="cover">
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <Text style={styles.h2}>Settings</Text>
          <Pressable onPress={() => navigation.navigate('Notification')}>
            <Image
              style={{width: 60, height: 60}}
              source={require('../assets/images/Inbox.png')}></Image>
          </Pressable>
        </View>
        <View style={{width: '90%', marginBottom: 20}}>
          <Text style={styles.h4}>Notifications</Text>
          <View style={styles.notificationItem}>
            <Text style={styles.h6}>Allow push notifications?</Text>
            <Switch
              trackColor={{false: '#767577', true: '#2dcb73'}}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        <View style={{width: '90%'}}>
          <Text style={styles.h4}>House Settings</Text>
          {/* <View style={styles.notificationItem}>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.h6}>Join House</Text>
            </Pressable>
          </View> */}
          <View style={styles.notificationItem}>
              <Text style={[styles.h6, {color: '#FF8D8D'}]}>Leave House</Text>  
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.h8}>Warning: You are only able to be registered with one house at a time. Joining a new house will remove you from your current home.</Text>
              <Text style={[styles.h6, {marginVertical: 15}]}>Enter your house code here:</Text>
              <TextInput style={styles.inputText} placeholder="XXXX-XXXX-XXXX" onChangeText={onChangeHouseCode} value={houseCode}/>
              <Pressable
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.h8}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  inputText:{
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#656565',
    borderRadius: 12,
    padding: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  background: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: '20%',
  },
  notificationItem: {
    backgroundColor: '#F3F5F6',
    marginVertical: 5,
    padding: 15,
    borderRadius: 12,
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  h4: {
    color: '#5A4C9C',
    fontWeight: 'bold',
    fontSize: 18,
  },
  h2: {
    color: '#6D74C9',
    fontWeight: 'bold',
    fontSize: 32,
  },
  h8: {
    color: '#656565',
    fontSize: 12,
  },
  h6: {
    color: '#656565',
    fontWeight: 'heavy',
    fontSize: 22,
  },
});

export default Settings;
