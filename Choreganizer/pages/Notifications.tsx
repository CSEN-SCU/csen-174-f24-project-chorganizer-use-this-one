import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, FlatList, Pressable, ScrollView } from 'react-native';
import { totalData } from '../assets/totalData';

function Notifications({ route, navigation: _navigation }: { route: any; navigation: any }): React.JSX.Element {
  const { newReport } = route.params || {}; // Retrieve new report from navigation params
  const currentUser = totalData.currentUser;
  const currentUserData = totalData.houseMates.find(mate => mate.name === currentUser);

    //Commented out my attempt to get the format of the time to be more readable

  // const fakeNotifications = [
  //   { tags: 'Achievement', message: '10 day streak!', time: new Date(new Date().getTime() - 1 * 60 * 1000).toISOString() },
  //   { tags: 'Mess reported', message: 'Spill in the kitchen', time: new Date(new Date().getTime() - 10 * 60 * 1000).toISOString() },
  //   { tags: 'Bump 👊', message: 'Mop floors', time: new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toISOString() },
  //   { tags: 'Reminder', message: 'Bleach towels', time: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  //   { tags: 'Reminder', message: 'Buy detergent', time: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  // ];

  // const [notifications, setNotifications] = useState(
  //   currentUserData?.notifications || fakeNotifications
  // );

  // Initialize notifications, including both old and new notifications
 const [notifications, setNotifications] = useState<{ time: string; message: string; tags: string; isNew?: boolean }[]>(currentUserData?.notifications || []);

 useEffect(() => {
  if (newReport) {
    const newNotification = {
      tags: 'Mess reported',
      message: newReport,
      time: new Date().toLocaleTimeString(),
      isNew: true,
    };
    // Prepend the new notification to the existing list to ensure it appears at the top
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  }
}, [newReport]);


  const handleDeleteNotification = (index: number) => {
    setNotifications(prevNotifications => prevNotifications.filter((_, i) => i !== index));
  };

  const handleNotificationPress = (item: { tags: string; message: string; time: string; isNew?: boolean }) => {
    if (item.tags !== 'Mess reported') {
      _navigation.navigate('Personal'); 
    }
  };

  //Commented out my attempt to get the format of the time to be more readable
  // function getRelativeTime(timestamp: string) {
  //   const now = new Date();
  //   const postedDate = new Date(timestamp);
  //   const diff = Math.floor((now.getTime() - postedDate.getTime()) / 1000); // Difference in seconds
  
  //   if (diff < 60) {
  //     return "Now";
  //   } else if (diff < 3600) {
  //     const minutes = Math.floor(diff / 60);
  //     return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  //   } else if (diff < 86400) {
  //     const hours = Math.floor(diff / 3600);
  //     return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  //   } else {
  //     const days = Math.floor(diff / 86400);
  //     return `${days} day${days !== 1 ? 's' : ''} ago`;
  //   }

    
  // }
  
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <ImageBackground
        source={require('../assets/images/backgroundBlur.png')}
        style={styles.background} // Use the existing background style
        resizeMode="cover"
      >
        <View style={styles.header}>
          <Text style={styles.h2}>Notification Center</Text>
         
         {/*} <Pressable onPress={() => navigation.navigate('Notification')}>
            <Image style={{ width: 60, height: 60 }} source={require('../assets/images/Inbox.png')} />
          </Pressable>*/}
        </View>

        {/* Wrap FlatList with ScrollView */}
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} style={styles.scrollView}>
          <FlatList
            data={notifications}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => handleNotificationPress(item)}>
                <View style={styles.notificationItem}>
                  <View style={styles.notificationHeader}>
                    <View style={
                      item.tags === 'Bump 👊' ? styles.bumpNotif : 
                      item.tags === 'Achievement' ? styles.achievementNotif : 
                      item.tags === 'Reminder' ? styles.reminderNotif : 
                      styles.messNotif
                    }>
                      <Text style={{ color: '#656565' }}>{item.tags}</Text>
                    </View>
                    <Text style={styles.timeText}>{item.time}</Text>
                    {/* <Text style={styles.timeText}>{getRelativeTime(item.time)}</Text> */}
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.h6}>{item.message}</Text>
                    <Pressable onPress={() => handleDeleteNotification(index)}>
                      {item.tags === 'Mess reported' ? (
                        <View style={styles.claimButton}>
            <Text style={{ color: 'white' }}>Claim</Text>
                </View>
              ) : (
                <Text style={{ fontSize: 22 }}> </Text>
              )}
            </Pressable>
            {/* Show delete button only for new notifications */}
            {/*{item.isNew && (
              <TouchableOpacity onPress={() => handleDeleteNotification(index)}>
                <Text style={styles.deleteButton}>🗑️</Text>
              </TouchableOpacity>
            )} 
            */}
          </View>
              </View>
              </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()} // Ensures each item has a unique key
          />
        </ScrollView>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    flexDirection: 'row',
    marginBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#F3F5F6',
    marginVertical: 5,
    padding: 15,
    borderRadius: 12,
    shadowColor: 'grey',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    gap: 10,
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

  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  notificationContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#656565',
    fontWeight: 'heavy',
    fontSize: 14,
  },
  claimButton: {
    backgroundColor: '#65558F',
    borderRadius: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  deleteButton: {
    color: '#FF0000',
    fontSize: 22,
    marginTop: 10,
  },
  scrollView: {
    width: '90%',
  },
});

export default Notifications;
