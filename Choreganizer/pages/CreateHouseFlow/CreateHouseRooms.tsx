import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

function CreateHouseRooms({navigation}: {navigation: any}): React.JSX.Element {
  const [rooms, setRooms] = useState([{roomName: '', chores: ['']}]);

  const addRoom = () => {
    setRooms([...rooms, {roomName: '', chores: ['']}]);
  };

  const addChore = roomIndex => {
    const updatedRooms = rooms.map((room, index) =>
      index === roomIndex ? {...room, chores: [...room.chores, '']} : room,
    );
    setRooms(updatedRooms);
  };

  const handleRoomChange = (text, index) => {
    const updatedRooms = rooms.map((room, i) =>
      i === index ? {...room, roomName: text} : room,
    );
    setRooms(updatedRooms);
  };

  const handleChoreChange = (text, roomIndex, choreIndex) => {
    const updatedRooms = rooms.map((room, rIndex) =>
      rIndex === roomIndex
        ? {
            ...room,
            chores: room.chores.map((chore, cIndex) =>
              cIndex === choreIndex ? text : chore,
            ),
          }
        : room,
    );
    setRooms(updatedRooms);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/backgroundBlur.png')}
        style={styles.background}
        resizeMode="cover">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.innerContainer}>
            {/* Back button and header */}
            <View style={styles.headerContainer}>
              {/* Back button */}
              <Pressable
                style={{alignSelf: 'flex-start', marginBottom: 20}}
                onPress={() => navigation.navigate('Create House Name')}>
                <Text>◀️</Text>
              </Pressable>

              {/* Header */}
              <Text style={styles.h2}>Make Your Rooms</Text>
              <Text style={styles.h6}>
                Add all the rooms in your home that require cleaning. Then,
                input the chores needed and who are responsible.
              </Text>
            </View>

            {/* Chore Chart */}
            {rooms.map((room, roomIndex) => (
              <View key={roomIndex} style={styles.roomContainer}>
                <TextInput
                  style={styles.roomInput}
                  placeholder="Room Name"
                  value={room.roomName}
                  onChangeText={text => handleRoomChange(text, roomIndex)}
                />
                {room.chores.map((chore, choreIndex) => (
                  <View key={choreIndex} style={styles.choreContainer}>
                    <TextInput
                      style={styles.choreInput}
                      placeholder="Chore Name"
                      value={chore}
                      onChangeText={text =>
                        handleChoreChange(text, roomIndex, choreIndex)
                      }
                    />
                  </View>
                ))}
                <TouchableOpacity onPress={() => addChore(roomIndex)}>
                  <Text style={styles.addChoreText}>+ Add a Chore</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Room Button */}
            <Pressable onPress={addRoom} style={styles.addRoomButton}>
              <Image
                style={{width: 35, height: 35}}
                source={require('../../assets/images/AddIcon.png')}
              />
              <Text style={{color: '#656565', fontSize: 24}}>Add a Room</Text>
            </Pressable>
          </View>
          <Pressable
            style={styles.buttonPrimary}
            onPress={() => {
              //HI BACKEND PEOPLE! PUT HERE THE SUBMISSION OF THE "rooms" ARRAY, JUST RIGHT ABOVE THE NAVIGATION LINE
              //YOU'RE KILLING IT! -beatrice & madi
              navigation.navigate('Create House Done');
            }}>
            <Text style={styles.buttonPrimaryText}>Confirm</Text>
          </Pressable>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  innerContainer: {
    width: '90%',
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 40,
    gap: 10,
  },
  roomContainer: {
    backgroundColor: '#e2e8ff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  roomInput: {
    fontSize: 20,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.25)',
    marginBottom: 10,
    width: '75%',
  },
  choreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#F3F5F6',
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 18,
  },
  choreInput: {
    fontSize: 16,
    width: '75%',
    padding: 4,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.25)',
  },
  addChoreText: {
    color: '#7a7ab2',
    fontSize: 14,
    marginTop: 5,
  },
  addRoomButton: {
    width: '100%',
    backgroundColor: '#F3F5F6',
    borderColor: '#E1E1E1',
    borderWidth: 1,
    borderRadius: 18,
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 15,
  },
  h2: {
    color: '#6D74C9',
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
  },
  h6: {
    color: '#6D74C9',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  background: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#6D74C9',
    width: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 30,
  },
  buttonPrimaryText: {
    color: '#eee',
    fontSize: 20,
  },
});

export default CreateHouseRooms;
