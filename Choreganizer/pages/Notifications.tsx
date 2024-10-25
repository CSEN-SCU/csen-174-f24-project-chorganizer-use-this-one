import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  Pressable,
  Image,
} from 'react-native';

import {totalData} from '../assets/totalData';

function Notifications({navigation}: {navigation: any}): React.JSX.Element {
  const currentUser = totalData.currentUser;
  const currentUserData = totalData.houseMates.find(mate => {
    mate.name == currentUser;
    return mate.chores;
  });
  const notifications = currentUserData?.notifications;

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
          <Text style={styles.h2}>Notification Center</Text>
          <Pressable onPress={() => navigation.navigate('Notification')}>
            <Image
              style={{width: 60, height: 60}}
              source={require('../assets/images/Inbox.png')}></Image>
          </Pressable>
        </View>
        <FlatList
          style={{width: '90%'}}
          data={notifications}
          renderItem={({item}) => (
            <View style={styles.notificationItem}>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                }}>
                <View
                  style={
                    item.tags === 'Bump 👊'
                      ? styles.bumpNotif
                      : item.tags === 'Mess reported'
                      ? styles.messNotif
                      : item.tags === 'Achievement'
                      ? styles.achievementNotif
                      : styles.reminderNotif
                  }>
                  <Text style={{color: '#656565'}}>{item.tags}</Text>
                </View>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.h6}>{item.message}</Text>
                <Pressable onPress={() => console.log('do something')}>
                  {item.tags === 'Bump 👊' ? (
                    <Text style={{fontSize: 22}}>✅</Text>
                  ) : item.tags === 'Mess reported' ? (
                    <View
                      style={{
                        backgroundColor: '#65558F',
                        borderRadius: 18,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                      }}>
                      <Text style={{color: 'white'}}>Claim</Text>
                    </View>
                  ) : item.tags === 'Achievement' ? (
                    <Text style={{fontSize: 22}}>🔥</Text>
                  ) : (
                    <Text style={{fontSize: 22}}>✅</Text>
                  )}
                </Pressable>
              </View>
            </View>
          )}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
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
    gap: 10
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
  h8: {
    color: '#656565',
    fontSize: 12,
  },
  h6: {
    color: '#656565',
    fontWeight: 'heavy',
    fontSize: 22,
  },
  bumpNotif: {
    backgroundColor: '#D0E1FD',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  messNotif: {
    backgroundColor: '#EFC1C1',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  achievementNotif: {
    backgroundColor: '#C1EFD8',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  reminderNotif: {
    backgroundColor: '#FCEFB4',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  timeText: {
    color: '#656565',
    fontWeight: 'heavy',
    fontSize: 14,
  },
});

export default Notifications;
