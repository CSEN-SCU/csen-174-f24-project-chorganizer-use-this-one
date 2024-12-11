import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {
  getHousemates,
  getUserInfo,
  getXUsersChoreData,
  auth,
} from '../firebase/firebaseConfig';
import {collection, onSnapshot} from 'firebase/firestore';
import {db, redistributeChores} from '../firebase/firebaseConfig';
import { reportMess } from '../firebase/report-mess/reportMess';
import { addMessNotification, emailMessNotification, sendBumpNotification, addNotification} from '../firebase/notifs/notifications.ts';

interface Chore {
  title: string;
  daysLeft: number;
}

interface Housemate {
  name: string;
  chores: Chore[];
}

function Home({navigation}: {navigation: any}): React.JSX.Element {
  const [currentChoreIndex, setCurrentChoreIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportText, setReportText] = useState('');
  const [totalUserChores, setTotalUserChores] = useState([]);

  const userID = auth.currentUser?.uid;


  // Inside useEffect:
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'chores'), snapshot => {
    if (!userID) return;
    // const fetchChores = async () => {
    //   try {
    //     const userInfo = await getUserInfo(userID);
    //     const houseID = userInfo?.house_id;

    //     const houseMateChoresArr = await getHousemates(houseID);
    //     console.log("step1: ", houseMateChoresArr);

    //     const toPresentArr = [];
    //     houseMateChoresArr.forEach(async (housemate)=>{
    //       const userChoreData = await getXUsersChoreData(housemate.uid);
    //       toPresentArr.push({
    //         "name": housemate.name,
    //         "chores": userChoreData
    //       })
    //     })

    //     await setTotalUserChores(toPresentArr);

    //     console.log('Chores fetched successfully:', totalUserChores);
    //   } catch (error) {
    //     console.error('Error fetching chore data:', error);
    //   }
    // };
    const fetchChores = async () => {
      try {
        
        const userInfo = await getUserInfo(userID);

        const houseID = userInfo?.house_id;
        const houseMateChoresArr = await getHousemates(houseID);
        console.log("step1: ", houseMateChoresArr);
    
        const toPresentArr = await Promise.all(
          houseMateChoresArr.map(async housemate => {
            const userChoreData = await getXUsersChoreData(housemate.uid);
            return {
              name: housemate.name,
              chores: userChoreData
              //REMOVE LATER ARRAN
              //id: housemate.id
            };
          })
        );
    
        setTotalUserChores(toPresentArr);
        console.log('Chores fetched successfully:', toPresentArr);
      } catch (error) {
        console.error('Error fetching chore data:', error);
      }
    };
    

    fetchChores();
  });
  return () => {
    unsubscribe();
  };
}, [userID]);
  
  //const testing = getHousemates(house.id);
  //console.log("AAA House members", testing)
  // for each housemate in housemates, you could do housemate.name, and then arran should have a get chores function for each user

  const housemates: Housemate[] = [
    {
      name: 'Olivia',
      chores: [
        {title: 'Mop Floors', daysLeft: 3},
        {title: 'Wipe Stove Top', daysLeft: 1},
        {title: 'Clean Fridge', daysLeft: 4},
        {title: 'Sweep Ground', daysLeft: 2},
        {title: 'Bleach Toilet', daysLeft: 5},
      ],
    },
    {
      name: 'Liam',
      chores: [
        {title: 'Mop Floors', daysLeft: 3},
        {title: 'Mop Floors', daysLeft: 1},
        {title: 'Mop Floors', daysLeft: 4},
        {title: 'Mop Floors', daysLeft: 2},
        {title: 'Mop Floors', daysLeft: 5},
        {title: 'Mop Floors', daysLeft: 5},
        {title: 'Mop Floors', daysLeft: 5},
        {title: 'Mop Floors', daysLeft: 5},
        {title: 'Mop Floors', daysLeft: 5},
        {title: 'Mop Floors', daysLeft: 5},
      ],
    },
    {
      name: 'Emma',
      chores: [{title: 'Mop Floors', daysLeft: 3}],
    },
  ];

  const nextChore = () => {
    setCurrentChoreIndex(
      currentIndex => (currentIndex + 1) % totalUserChores.length,
    );
  };

  const prevChore = () => {
    setCurrentChoreIndex(currentIndex =>
      currentIndex === 0 ? totalUserChores.length - 1 : currentIndex - 1,
    );
  };

  const handleAddMessReport = (reportText: string) => {
    // Report a Mess
    const user_id = auth.currentUser!.uid
    reportMess(user_id, reportText).then((mess_id) => {

        // create a mess notification in the database
        addMessNotification(user_id, mess_id, reportText);
        emailMessNotification(user_id, reportText)

        // send mess notification via email

    })
    setReportText(''); // Clear input after reporting mess
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
        source={require('../assets/images/backgroundBlur.png')}
        style={styles.background}
        resizeMode="cover">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.h2}>Welcome Home!</Text>
            <Pressable
              onPress={() => navigation.navigate('Notification')}
              accessibilityLabel="Open notifications">
              <Image
                style={styles.notificationIcon}
                source={require('../assets/images/Inbox.png')}
              />
            </Pressable>
          </View>

          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => setModalVisible(true)}
            accessibilityLabel="Report a mess">
            <Image
              style={styles.reportIcon}
              source={require('../assets/images/ReportIcon.png')}
            />
            <Text style={styles.reportButtonText}>Report a Mess</Text>
          </TouchableOpacity>

          {/* Report Mess Modal */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                  accessibilityLabel="Close report modal">
                  <Text style={styles.closeButtonText}>X</Text>
                </Pressable>
                <View style={styles.modalHeader}>
                  <Image
                    style={styles.reportIcon}
                    source={require('../assets/images/ReportIcon.png')}
                  />
                  <Text style={styles.modalTitle}>Report a Mess</Text>
                </View>
                <TextInput
                  style={styles.reportInput}
                  multiline={true}
                  placeholder="Describe the mess..."
                  onChangeText={setReportText}
                  value={reportText}
                />
                <TouchableOpacity
                  style={styles.postReportButton}
                  onPress={() => {
                    handleAddMessReport(reportText);
                    setModalVisible(false);
                    navigation.navigate('Notification', {
                      newReport: reportText,
                    });
                  }}>
                  <Text style={styles.postReportButtonText}>Post Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Housemate Chores Section */}
          <View style={styles.choreContainer}>
            <View style={styles.choreNavigation}>
              <TouchableOpacity onPress={prevChore} style={styles.navButton}>
                <Image
                  style={styles.chevronIcons}
                  source={require('../assets/images/ChevronLeft.png')}
                />
              </TouchableOpacity>

              {totalUserChores.length > 0 &&
              <View style={styles.choreCard}>
                <Text style={styles.choreName}>
                  {totalUserChores[currentChoreIndex]?.name}
                </Text>
                {totalUserChores[currentChoreIndex].chores.length > 0 ? (
                  totalUserChores[currentChoreIndex].chores.map((chore, index) => (
                    <View key={index} style={styles.choreItem}>
                      <View style={styles.choreTextContainer}>
                        <Text style={styles.choreDays}>
                          {chore.choreStatus ? "Done" : "Incomplete"}
                        </Text>
                        <Text style={styles.choreTitle}>{chore.name}</Text>
                      </View>
                      <TouchableOpacity onPress={async ()=> {
                        await addNotification(auth.currentUser!.uid, housemates[currentChoreIndex].name, chore.name);
                        // TODO: change the email to be the receiver user's email
                        //getBumpedUser(chore.title);
                        const Bumpeename = await sendBumpNotification(auth.currentUser!.uid, chore.name);
                        console.log("numppeename = ", Bumpeename);
                        Alert.alert(`${Bumpeename} has been bumped!`);

                      }} style={styles.fistBumpButton}>
                        <Text style={styles.fistBumpIcon}>{chore.choreStatus ? "✅" : "👊"}</Text>

                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text>No chores assigned.</Text>
                )}
              </View>
              }

              <TouchableOpacity onPress={nextChore} style={styles.navButton}>
                <Image
                  style={styles.chevronIcons}
                  source={require('../assets/images/ChevronRight.png')}
                />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  h2: {
    color: '#6D74C9',
    fontWeight: 'bold',
    fontSize: 32,
  },
  notificationIcon: {
    width: 60,
    height: 60,
    marginRight: -5,
  },
  reportButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDE7F9',
    width: '90%',
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reportIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  reportButtonText: {
    color: '#333',
    opacity: 0.8,
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 60,
  },
  choreContainer: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 30,
    paddingRight: 5,
    backgroundColor: 'transparent', // updated background color
    borderRadius: 15,
  },
  choreNavigation: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  chevronIcons: {
    width: 30,
    height: 30,
  },

  navButton: {
    width: 50, // increased width
    height: 50, // increased height
    backgroundColor: '#F3F5F6',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: -30, // added margin to prevent cropping
    zIndex: 10,

    // Drop shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Drop shadow for Android
    elevation: 5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  choreCard: {
    backgroundColor: '#E2ECFC', // Set background color for each chore card
    width: '85%', // Width to allow peeking on both sides
    padding: 15,
    borderRadius: 10,
    alignItems: 'flex-start',
    marginHorizontal: 20, // Add margin to separate each card

    // Drop shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Drop shadow for Android
    elevation: 5,
  },
  choreName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  choreItem: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 10, // Add top margin for spacing between items
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    // Drop shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Drop shadow for Android
    elevation: 5,
  },
  choreTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
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
    marginLeft: 'auto', // Aligns the button to the right
  },
  fistBumpIcon: {
    fontSize: 24,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#999',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  reportInput: {
    height: 150,
    borderRadius: 10,
    backgroundColor: '#F3F5F6',
    padding: 10,
    marginVertical: 15,
    textAlignVertical: 'top',
  },
  postReportButton: {
    backgroundColor: '#6D74C9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  postReportButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
export default Home;
