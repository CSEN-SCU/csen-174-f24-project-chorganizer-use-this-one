import {
  collection,
  addDoc,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import {auth, db} from './../firebaseConfig';

async function createRoom(roomName) {
  try {
    //const roomRef = doc(db, "rooms", roomId.toString())
    const roomRef = await addDoc(collection(db, 'rooms'), {
      name: roomName,
      chores: [null],
      house: null,
    });
    console.log('room created successfully w/ id of ', roomRef.id);
    await updateDoc(roomRef, {id: roomRef.id}); //return ((await getDoc(roomRef) ).data())
  } catch (error) {
    console.error('Error creating room! error: ', error);
  }
}

async function assignChorestoRooms(roomName, choreArray) {
  try {
    const roomRef = collection(db, 'rooms');
    const choreRef = collection(db, 'chores');

    // Query to find the room by name
    const roomQuery = query(roomRef, where('name', '==', roomName));
    const roomSnapshot = await getDocs(roomQuery);
    const roomDoc = roomSnapshot.docs[0];

    if (!roomDoc) {
      console.log(`Room "${roomName}" not found`);
      return;
    }

    const roomDocRef = doc(db, 'rooms', roomDoc.id); // Reference for the room document
    const choreDocs = [];

    for (let choreName of choreArray) {
      // Check if the chore already exists
      const choreQuery = query(choreRef, where('name', '==', choreName));
      const choreSnapshot = await getDocs(choreQuery);

      let choreDocId;

      if (!choreSnapshot.empty) {
        // If chore exists, use its ID
        choreDocId = choreSnapshot.docs[0].id;
        console.log(`Chore "${choreName}" found with ID: ${choreDocId}`);
      } else {
        // If chore doesn't exist, create it
        console.log(`Chore "${choreName}" not found, creating it`);
        const newChoreDoc = await addDoc(choreRef, {name: choreName});
        choreDocId = newChoreDoc.id;
        console.log(`Chore "${choreName}" created with ID: ${choreDocId}`);
      }

      choreDocs.push(choreDocId); // Add the chore ID to the list
    }

    if (choreDocs.length > 0) {
      // Update the room document with chore IDs
      await updateDoc(roomDocRef, {
        chores: arrayUnion(...choreDocs),
      });
      console.log('Chores assigned successfully to the room:', roomName);
    } else {
      console.log('No valid chores to assign');
    }
  } catch (error) {
    console.error('Error assigning chores to room:', error);
  }
}

async function assignChoresToRoom(roomId, choreId, db) {
  try {
    const roomRef = doc(db, 'rooms', roomId.toString());
    await updateDoc(roomRef, {
      chores: arrayUnion(choreId),
    });
    console.log(
      'chore (with id of: ',
      choreId,
      ') was successfully added into room (with id of: ',
      roomId,
    );
  } catch (error) {
    console.error('Error adding chore to room! error: ', error);
  }
}

async function assignUser(roomId, userId, db) {
  try {
    // Update house document to add the user to the members array
    const roomRef = doc(db, 'room', roomId);
    await updateDoc(roomRef, {
      members: arrayUnion(userId),
    }); // Update the user profile with the house ID

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {room_id: roomId});

    console.log('User added to house');
  } catch (error) {
    console.error('Error joining house:', error);
  }
}

export {createRoom, assignChorestoRooms, assignUser};
