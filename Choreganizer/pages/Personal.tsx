import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import ExpandableList from '../assets/components/CollapsibleView';
import {
  getUserInfo,
  getXUsersChoreData,
  getXUsersChoreDataPersonal,
  auth,
} from '../firebase/firebaseConfig';
import {collection, onSnapshot} from 'firebase/firestore';
import {db} from '../firebase/firebaseConfig';

function Personal({navigation}) {
  const userInfo = auth.currentUser?.uid;
  const userName = auth.currentUser?.displayName;
  const [userStreak, setUserStreak] = useState(0);
  const [numChores, setNumChores] = useState(0);
  const [currentUserChoreNames, setCurrentUserChoreNames] = useState<string[]>(
    [],
  );
  const [upcomingText, setUpcomingText] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'chores'), snapshot => {
      if (!userInfo) return;
      const fetchChores = async () => {
        try {
          const userInfoForStreak = await getUserInfo(userInfo);
          setUserStreak(userInfoForStreak.streak);

          const chores = await getXUsersChoreDataPersonal(userInfo);
          setCurrentUserChoreNames(chores);

          if (chores.length > 0) {
            setUpcomingText(chores[0].name + ": " + chores[0].tasks[0]?.name || 'No tasks');

            let counter = 0;
            chores.forEach(room => {
              room.tasks.forEach((chore) => {
                if (!chore.choreStatus) {
                  counter++;
                }
              });
            });

            setNumChores(counter);
          } else {
            setUpcomingText('No chores available');
            setNumChores(0);
          }

          console.log('Chores fetched successfully:', chores);
        } catch (error) {
          console.error('Error fetching chore data:', error);
        }
      };
      fetchChores();
    });
    return () => {unsubscribe()};
  }, [, userInfo]);

  const renderItem = ({item}) => {
    switch (item.key) {
      case 'header':
        return (
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.h2}>Hi, {userName}!</Text>
              <Text style={styles.h4}>You have {numChores} chores left</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('Notification')}>
              <Image
                style={styles.inboxIcon}
                source={require('../assets/images/Inbox.png')}
              />
            </Pressable>
          </View>
        );
      case 'thumbnails':
        return (
          <View style={styles.thumbnailContainer}>
            {/* Add content for each thumbnail */}
            <View style={styles.thumbnailBox}>
              <Image
                style={{marginBottom: 10}}
                source={require('../assets/images/Streak.png')}
              />
              <Text style={styles.h6}>{userStreak} day streak</Text>
            </View>

            <View style={styles.upcomingBox}>
              <View style={styles.yellowHighlightBox}></View>
              <View style={styles.upcomingTextSection}>
                <Text style={styles.h6}>Upcoming</Text>
                <Text style={styles.h8}>
                  {upcomingText}
                </Text>
              </View>
            </View>
          </View>
        );
      case 'chores':
        return (
          <View style={styles.expandableContainer}>
            <ExpandableList data={currentUserChoreNames} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/backgroundBlur.png')}
        style={styles.background}
        resizeMode="cover">
        <Pressable onPress={() => navigation.navigate('AuthScreen')}>
          <Text>DEV ROUTE: Load Auth</Text>
        </Pressable>
        <FlatList
          data={[{key: 'header'}, {key: 'thumbnails'}, {key: 'chores'}]}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  background: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: '20%',
  },
  flatListContent: {
    width: '100%',
    alignItems: 'center',
  },
  headerContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inboxIcon: {
    width: 60,
    height: 60,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  upcomingBox: {
    backgroundColor: '#F3F5F6',
    width: '48%',
    borderRadius: 18,
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  yellowHighlightBox: {
    height: 30,
    backgroundColor: '#FCEFB4',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  },
  upcomingTextSection: {
    padding: 15,
    display: 'flex',
    justifyContent: 'center',
  },
  thumbnailBox: {
    backgroundColor: '#F3F5F6',
    width: '48%',
    borderRadius: 18,
    padding: 15,
    alignItems: 'center',
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  highlight: {
    height: 30,
    backgroundColor: '#FCEFB4',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
  },
  thumbnailContent: {
    padding: 15,
    justifyContent: 'center',
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  expandableContainer: {
    width: '90%',
    marginTop: 20,
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
});

export default Personal;
