import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import ExpandableList from '../assets/components/CollapsibleView';

import { totalData } from '../assets/totalData';

function Personal({navigation}: {navigation: any}): React.JSX.Element {
  // const chores = [
  //   {name: 'Kitchen',
  //     tasks: [
  //       {time: '2 days', chore: 'mop floors', status: true},
  //       {time: '5 days', chore: 'wipe stovetop', status: false},
  //       {time: '1 week', chore: 'clean fridge', status: true},
  //     ],
  //   },
  //   {
  //     name: 'Bathroom',
  //     tasks: [
  //       {time: '2 days', chore: 'mop floors', status: true},
  //       {time: '5 days', chore: 'wipe stovetop', status: false},
  //     ],
  //   },
  //   {
  //     name: 'Living Room',
  //     tasks: [
  //       {time: '5 days', chore: 'wipe stovetop', status: false},
  //       {time: '1 week', chore: 'clean fridge', status: true},
  //     ],
  //   },
  // ];


  const currentUser = totalData.currentUser;
  const currentUserData = totalData.houseMates.find((mate) => {mate.name == currentUser; return mate.chores})
  const chores = currentUserData?.chores;

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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}} >
          {/* Hi __ Section */}
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '90%',
              flexDirection: 'row',
              marginBottom: 20,
            }}>
            <View>
              <Text style={styles.h2}>Hi, name!</Text>
              <Text style={styles.h4}>You have x chores left</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('Notification')}>
              <Image
                style={{width: 60, height: 60}}
                source={require('../assets/images/Inbox.png')}></Image>
            </Pressable>
          </View>
          {/* Thumbnails */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
            }}>
            <View
              style={{
                backgroundColor: '#F3F5F6',
                width: '48%',
                borderRadius: 18,
                shadowColor: 'grey',
                shadowOffset: {width: 1, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 3,
                padding: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{marginBottom: 10}}
                source={require('../assets/images/Streak.png')}></Image>
              <Text style={styles.h6}>X day streak</Text>
            </View>
            <View
              style={{
                backgroundColor: '#F3F5F6',
                width: '48%',
                borderRadius: 18,
                shadowColor: 'grey',
                shadowOffset: {width: 1, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <View
                style={{
                  height: 30,
                  backgroundColor: '#FCEFB4',
                  borderTopRightRadius: 18,
                  borderTopLeftRadius: 18,
                }}></View>
              <View
                style={{padding: 15, display: 'flex', justifyContent: 'center'}}>
                <Text style={styles.h6}>Upcoming</Text>
                <Text style={styles.h8}>"You have stuff to do. Witerwally go do it. 🎩" -Abraham Lincoln</Text>
              </View>
            </View>
          </View>
          {/* Dropdown list section */}
          <View style={{width: '90%', marginTop: 20}}>
              <ExpandableList data={chores}></ExpandableList>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  houseGraphic: {
    width: 300,
    height: 300, // Add a height here to avoid cropping
    resizeMode: 'contain', // Use contain to keep the aspect ratio
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

export default Personal;
