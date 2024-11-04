import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';

// Define types for housemates and chores
interface Chore {
  title: string;
  daysLeft: number;
}

interface Housemate {
  name: string;
  chores: Chore[];
}

function Home({ navigation }: { navigation: any }): React.JSX.Element {
  const [currentChoreIndex, setCurrentChoreIndex] = useState(0);

  // Sample data for housemates and their chores
  const housemates: Housemate[] = [
    { name: 'Olivia', chores: [{ title: 'Mop Floors', daysLeft: 3 }] },
    { name: 'Liam', chores: [{ title: 'Take Out Trash', daysLeft: 2 }] },
    { name: 'Emma', chores: [{ title: 'Clean Kitchen', daysLeft: 5 }] },
  ];

  const nextChore = () => {
    setCurrentChoreIndex((currentIndex) => (currentIndex + 1) % housemates.length);
  };

  const prevChore = () => {
    setCurrentChoreIndex((currentIndex) =>
      currentIndex === 0 ? housemates.length - 1 : currentIndex - 1
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <ImageBackground
        source={require('../assets/images/backgroundBlur.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {/* Hi __ Section */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.h2}>Welcome Home!</Text>
            <Pressable
              onPress={() => navigation.navigate('Notification')}
              accessibilityLabel="Open notifications"
            >
              <Image
                style={{ width: 60, height: 60 }}
                source={require('../assets/images/Inbox.png')}
              />
            </Pressable>
          </View>

          {/* Report a Mess Button */}
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => {
              navigation.navigate('ReportMess'); // Navigate to report mess screen
            }}
            accessibilityLabel="Report a mess"
          >
            <Image
              style={styles.reportIcon}
              // source={require('../assets/images/ReportIcon.png')}
            />
            <Text style={styles.reportButtonText}>Report a Mess</Text>
          </TouchableOpacity>

          {/* Housemate Chores Section */}
          <View style={styles.choreContainer}>
            <View style={styles.choreNavigation}>
              <TouchableOpacity onPress={prevChore} style={styles.navButton}>
                <Text style={styles.navButtonText}>{'<'}</Text>
              </TouchableOpacity>

              <View style={styles.choreCard}>
                <Text style={styles.choreName}>{housemates[currentChoreIndex].name}</Text>
                {housemates[currentChoreIndex].chores.length > 0 ? (
                  housemates[currentChoreIndex].chores.map((chore, index) => (
                    <View key={index} style={styles.choreItem}>
                      <Text style={styles.choreDays}>{chore.daysLeft} days left</Text>
                      <Text style={styles.choreTitle}>{chore.title}</Text>
                      <TouchableOpacity style={styles.fistBumpButton}>
                        <Text style={styles.fistBumpIcon}>👊</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text>No chores assigned.</Text>
                )}
              </View>

              <TouchableOpacity onPress={nextChore} style={styles.navButton}>
                <Text style={styles.navButtonText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  welcomeContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    flexDirection: 'row',
    marginBottom: 20,
  },
  h2: {
    color: '#6D74C9',
    fontWeight: 'bold',
    fontSize: 32,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6D74C9',
    width: '90%',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  reportIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  choreContainer: {
    width: '100%',
    alignItems: 'center',
  },
  choreNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    width: 40,
    height: 40,
    backgroundColor: '#6D74C9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  choreCard: {
    width: '80%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  choreName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  choreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  choreDays: {
    color: '#999',
    fontSize: 14,
    marginRight: 10,
  },
  choreTitle: {
    fontSize: 18,
    flex: 1,
  },
  fistBumpButton: {
    padding: 10,
  },
  fistBumpIcon: {
    fontSize: 24,
  },
});

export default Home;
