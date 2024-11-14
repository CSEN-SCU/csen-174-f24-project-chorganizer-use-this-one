import React from 'react';
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
import {totalData} from '../assets/totalData';

function Personal({navigation}) {
  const currentUser = totalData.currentUser;
  const currentUserData = totalData.houseMates.find(
    mate => mate.name === currentUser,
  );
  const chores = currentUserData?.chores;

  const renderItem = ({item}) => {
    switch (item.key) {
      case 'header':
        return (
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.h2}>Hi, name!</Text>
              <Text style={styles.h4}>You have x chores left</Text>
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
              <Text style={styles.h6}>X day streak</Text>
            </View>

            <View style={styles.upcomingBox}>
              <View style={styles.yellowHighlightBox}></View>
              <View style={styles.upcomingTextSection}>
                <Text style={styles.h6}>Upcoming</Text>
                <Text style={styles.h8}>
                  "You have stuff to do. Witerwally go do it. 🎩" -Abraham
                  Lincoln
                </Text>
              </View>
            </View>
          </View>
        );
      case 'chores':
        return (
          <View style={styles.expandableContainer}>
            <ExpandableList data={chores} />
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
