import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  arrayRemove
} from 'firebase/firestore';
import {
  auth,
  db,
  assignChorestoUsers,
  redistributeChores,
  getUserInfo,
} from '../firebaseConfig';
import {getFunctions, httpsCallable} from 'firebase/functions';

const functions = getFunctions();

// Create a new house
async function createHouse(houseName) {
  try {
    //const user = auth.currentUser;
    const docRef = await addDoc(collection(db, 'houses'), {
      name: houseName || 'House',
      head_user: user.uid,
      members: [user.uid],
      invitations: [],
      invitationCodes: [] || null,
      rooms: [],
      choresDue: null,
      chores: [],
    });
    await updateDoc(docRef, {id: docRef.id});
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7;
    const nextSundayMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilSunday,
    );
    await updateDoc(docRef, {choresDue: nextSundayMidnight});
    //await updateDoc(docRef, { choresDue: nextSundayMidnight});

    console.log('House created successfully with docRef of ', docRef);

    const userRef = collection(db, 'users'); //, user.uid);
    userQuery = query(userRef, where('uid', '==', user.uid));
    const userCheck = await getDocs(userQuery);
    const correct = userCheck.docs[0].ref;

    console.log('correct is:', correct);
    await updateDoc(correct, {house_id: docRef.id});
    console.log('i think i wont show up');

    return (await getDoc(docRef)).data();
  } catch (error) {
    console.error('Error creating house:', error);
    throw error;
  }
}

// Invite users to a house
// async function inviteUserToHouse(houseId, invitedEmails) {
//     try {
//         //console.log("the house id is, ", houseId);
//         const houseRef = collection(db, "houses");
//         const houseQuery = query(houseRef, where("id", "==", houseId))
//         const houseData1 = await getDocs(houseQuery);

//         if (houseData1.empty) {
//             throw new Error(`House with ID ${houseId} does not exist.`);
//         }

//         const houseData = houseData1.docs[0];

//         if (!houseData.exists()) {
//             throw new Error(`House with ID ${houseId} does not exist.`);
//         }

//         console.log("HIII", invitedEmails);
//         const sendEmail = httpsCallable(functions, "sendEmail");

//         for (const invitee of invitedEmails) {
//             const joinCode = Math.floor(1000 + Math.random() * 9000);

//             // Update Firestore with invitation data
//             await updateDoc(houseRef, {
//                 invitations: arrayUnion(invitee),
//                 invitationCodes: arrayUnion(joinCode),
//             });

//             // Call the Cloud Function to send an email
//             const result = await sendEmail({
//                 email: invitee,
//                 joinCode: joinCode,
//             });

//             console.log(`Email sent to ${invitee}:`, result.data);
//         }
//     } catch (error) {
//         console.error("Error inviting user to house:", error);
//     }
// }
async function inviteUserToHouse(houseId, invitedEmails) {
  try {
    const houseRef = collection(db, 'houses');
    const houseQuery = query(houseRef, where('id', '==', houseId));
    const houseData1 = await getDocs(houseQuery);

    if (houseData1.empty) {
      throw new Error(`House with ID ${houseId} does not exist.`);
    }

    const houseData = houseData1.docs[0]; // First document
    console.log('2', houseData.data()); //this works!

    const sendEmail = httpsCallable(functions, 'sendEmail');

    console.log('here!');

    for (const invitee of invitedEmails) {
      const joinCode = Math.floor(1000 + Math.random() * 9000);

      console.log('Updating Firestore for invitee:', invitee); // Update Firestore with invitation data
      await updateDoc(houseData.ref, {
        invitations: arrayUnion(invitee),
        invitationCodes: arrayUnion(joinCode),
      });
      console.log('Firestore updated successfully for:', invitee); // Call the Cloud Function to send an email

      const result = await sendEmail({
        email: invitee,
        joinCode: joinCode,
      });

      console.log(`Email sent to ${invitee}:`, result.data);
    }
  } catch (error) {
    console.error('Error inviting user to house:', error);
  }
}

// Verify invitation
async function verifyInvite(houseId, joinCode) {
    try {
        const user = auth.currentUser;
        const houseRef = doc(db, 'houses', houseId);
        const houseData = await getDoc(houseRef);

        if (!houseData.exists()) {
            throw new Error(`House with ID ${houseId} does not exist.`);
        }

        const data = houseData.data();
        const index = data.invitations.indexOf(user?.email);

        if (index >= 0 && data.invitationCodes[index] === joinCode) {
            // Update Firestore with new member and clear invitation
            await updateDoc(houseRef, {
                members: arrayUnion(user.uid),
                invitations: data.invitations.filter((_, i) => i !== index),
                invitationCodes: data.invitationCodes.filter((_, i) => i !== index),
            }); // Link the user to the house in Firestore

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {house_id: houseId});

            console.log('User successfully added to house');
            //await redistributeChores(houseId);
            console.log('ANd the chores were re-assigned to ppl!!!');
        } else {
            throw new Error('Invalid join code or email not invited.');
        }
    } catch (error) {
        console.error('Error verifying invite:', error);
    }
}

// Get housemates
async function getHousemates(houseId) {
    try {
        const houseRef = doc(db, 'houses', houseId);
        const houseData = await getDoc(houseRef);
    
        if (!houseData.exists()) {
          throw new Error(`House with ID ${houseId} does not exist.`);
        }
    
        const members = houseData.data().members; // Fetch all housemates concurrently
        console.log('Members:', members);
    
        const housemates = await Promise.all(
          members.map(async memberId => {
            try {
              console.log("memberId", memberId);
              const userInfo = await getUserInfo(memberId)
              
              return userInfo;
            } catch (error) {
              console.error(`Failed to fetch user ${memberId}:`, error);
              return null;
            }
          })
        );
      
        return housemates; // Remove null values
      } catch (error) {
        console.error('Error getting housemates:', error);
        throw error; // Re-throw the error for upstream handling
      }
    }


// async function getHousemates(houseId) {
//   try {
//     const houseRef = doc(db, 'houses', houseId);
//     const houseData = await getDoc(houseRef);

//     if (!houseData.exists()) {
//       throw new Error(`House with ID ${houseId} does not exist.`);
//     }

//     const members = houseData.data().members; // Fetch all housemates concurrently

//     const housemates = await Promise.all(
//       members.map(async memberId => {
//         const userRef = doc(db, 'users', memberId);
//         const userDoc = await getDoc(userRef);
//         return userDoc.exists() ? userDoc.data() : null;
//       }),
//     );

//     return housemates.filter(Boolean); // Remove null values
//   } catch (error) {
//     console.error('Error getting housemates:', error);
//   }
// }

async function assignChorestoHouse(houseId) {
    try {

        const houseRef = doc(db, 'houses', houseId);

        const choreRef = collection(db, 'chores');
        const choreQuery = query(choreRef, where('house', '==', houseId));
        const choreSnapshot = await getDocs(choreQuery);

        const choreDocs = choreSnapshot.docs.map(choreDoc => choreDoc.data().name);


        if (choreDocs.length > 0) {
            await updateDoc(houseRef, {
                chores: choreDocs,
            });
            console.log('Chores assigned successfully to the house:', houseId);
        } else {
            console.log('No chores found for the house:', houseId);
        }
    } catch (error) {
        console.error('Error assigning chore to house! error: ', error);
    }
}

/*async function assignRoomstoHouse(houseId) {
    try {

        const houseRef = doc(db, 'houses', houseId);

        const roomRef = collection(db, 'rooms');
        const roomnQuery = query(roomRef, where('house', '==', houseId));
        const choreSnapshot = await getDocs(choreQuery);

        const choreDocs = choreSnapshot.docs.map(choreDoc => choreDoc.data().name);


        if (choreDocs.length > 0) {
            await updateDoc(houseRef, {
                chores: choreDocs,
            });
            console.log('Chores assigned successfully to the house:', houseId);
        } else {
            console.log('No chores found for the house:', houseId);
        }
    } catch (error) {
        console.error('Error assigning chore to house! error: ', error);
    }
}*/




async function resetChoreDueDates(houseId) {
    const houseRef = doc(db, 'houses', houseId);
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7;
    const nextSundayMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + daysUntilSunday,
    );
    await updateDoc(houseRef, {choresDue: nextSundayMidnight});

    const choreRef = collection(db, 'chores');
    const choreQuery = query(choreRef, where('house', '==', houseId));
    const choreSnapshot = await getDocs(choreQuery);

    for (const choreDoc of choreSnapshot.docs) {
        const choreId = choreDoc.id;
        await updateDoc(doc(db, 'chores', choreId), {choreDue: nextSundayMidnight});
    }
}

async function swapTimeChecker(houseId) {
    const houseRef = doc(db, 'houses', houseId);
    const houseSnap = await getDoc(houseRef);
    const houseData = houseSnap.data();
    const dueDate = houseData.choresDue;
    const now = new Date();
    // FOR DEMO-PURPOSES ONLY!!! DELETE LATER!!!! ARRAN DONT FORGET

    //now.setDate(now.getDate() + 10);
    console.log('swaptimechecker: the rn date is: ', now);
    //await redistributeChores(houseId);
    const dueDateObj = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
    console.log('swaptimechecker: the housechoredue date is: ', dueDateObj);
    if (dueDateObj <= now) {
        console.log("the date was due, swapping chores!!!");
        redistributeChores(houseId);
        // try {
        //     const userRef = collection(db, 'users');
        //     const choreRef = collection(db, 'chores');

        //     const userQuery = query(userRef, where('house_id', '==', houseId));
        //     const choreQuery = query(choreRef, where('house', '==', houseId));

        //     const userSnapshot = await getDocs(userQuery);
        //     const choreSnapshot = await getDocs(choreQuery);

        //     console.log("line 341 done!");

        //     const users = userSnapshot.docs.map(doc => ({
        //         id: doc.data().id,
        //         choresAssigned: doc.data().choreAssigned || [],
        //     }));

        //     console.log("line 349 this is what users is: ", users);
        //     const numUsers = users.length;
        //     if (numUsers < 2) {
        //         console.log('Not enough users to shift chores.');
        //         return;
        //     }

        //     // Map current users to the next users
        //     const userMap = new Map();
        //     for (let i = 0; i < numUsers; i++) {
        //         const nextIndex = (i + 1) % numUsers;
        //         userMap.set(users[i].id, users[nextIndex].id);
        //     }

        //     const updates = [];

        //     //const numUsers = users.length;
        //     //console.log("line 349 done!");

        //     //if (numUsers < 2) {
        //     //    console.log('Not enough users to shift chores.');
        //     //    return;
        //     //}

        //     //for (let i = 0; i < numUsers; i++) {
        //     //    const nextIndex = (i + 1) % numUsers;
        //     //    users[i].nextUserId = users[nextIndex].id;
        //     //}
        //     console.log("line 360 done!, this is users now: ", users);

        //     //const updates = [];
        //     /*
        //     for (const user of users) {
        //         const choresToReassign = user.choresAssigned;
        //         updates.push(
        //             updateDoc(doc(db, 'users', user.id), {
        //                 choreAssigned: [],
        //             }),
        //         );

        //         for (const choreId of choresToReassign) {
        //             updates.push(
        //                 updateDoc(doc(db, 'chores', choreId), {
        //                 choreUser: user.nextUserId,
        //                 }),
        //             );
        //             updates.push(
        //                 updateDoc(doc(db, 'users', user.nextUserId), {
        //                 choreAssigned: arrayUnion(choreId),
        //                 }),
        //             );
        //         }
        //     }*/
        //     for (const user of users) {
        //         const choresToReassign = user.choresAssigned;
        //         for (const choreId of choresToReassign) {
        //             const nextUserId = userMap.get(user.id);
        //             updates.push(
        //                 updateDoc(doc(db, 'chores', choreId), {
        //                     choreUser: nextUserId,
        //                 })
        //             );
        //             updates.push(
        //                 updateDoc(doc(db, 'users', nextUserId), {
        //                     choreAssigned: arrayUnion(choreId),
        //                 })
        //             );
        //             updates.push(
        //                 updateDoc(doc(db, 'users', user.id), {
        //                     choreAssigned: arrayRemove(choreId),
        //                 })
        //             );
        //         }
        //     }
        //     console.log("line 385 done!");
        //     await Promise.all(updates);
        //     await resetChoreDueDates(houseId);
        //     console.log('Successfully shifted chores to the next user.');
        // } catch (error) {
        //     console.error('Error shifting chores to next user! Error:', error);
        // }
    }
}
//const choreQuery = query(houseRef, where("due", "==", houseId));

//const daysUntilSunday = (7 - now.getDay()) % 7;
//const nextSundayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday);

// await updateDoc(houseRef, { choresDue: nextSundayMidnight });

// const choreRef = collection(db, "chores");
// const choreQuery = query(choreRef, where("house", "==", houseId));
// const choreSnapshot = await getDocs(choreQuery);

// for (const choreDoc of choreSnapshot.docs) {
//     const choreId = choreDoc.id;
//     await updateDoc(doc(db, 'chores', choreId), {choreDue: nextSundayMidnight});
// }

// async function settingChoresDueDates(houseId) {
//     try {
//         const houseRef = doc(db, "houses", houseId);
//         const houseData = await getDoc(houseRef);
//         if (!houseData.exists()) {
//             throw new Error(`House with ID ${houseId} does not exist.`);
//         }
//         const choreRef = collection(db, 'chores');
//         choreQuery = query(choreRef, where('house', '==', houseId));
//         choreDue || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
//         const choreCheck = await getDocs(choreQuery);
//         const numChores = choreCheck.size;

//         if (numChores === 0) {
//             console.log('im a house trying to set my chores due dates, but there were no chores found!');
//             return;
//         }
//         for (const choreDoc of choreCheck.docs) {
//             const choreId = choreDoc.id;
//             //const choreData = choreDoc.data();
//             await updateDoc(doc(db, 'chores', choreId), {choreDue: nextSundayMidnight});
//         }
//     } catch (error) {
//         console.error('Error assigning chores a due date in house.js! error: ', error);
//     }
// }

//const checkChoreDueDates = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
// async function choreSwapTimerThingy(houseId) {
//     const now = new Date();
//     const houseRef = db.collection('houses');
//     const choreRef = collection(db, "chores");
//     choreQuery = query(choreRef, where('house', '==', houseId));
//     //userQuery = query(userRef, where('house_id', '==', houseId));
//     const choreCheck = await getDocs(choreQuery);

//     //choreDue || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
//     //choreQuery = query(choreQuery, where("houseId", "==", docRef.id));
//     //const snapshot = await houseRef.where('choresDue', '<=', now).get();
//     await updateDoc(choreRef, {id: choreRef.id});
//     if (snapshot.empty) {
//         console.log('No chores due or overdue.');
//         return null;
//     }
//     snapshot.forEach((doc) => {
//         const house = doc.data();
//         console.log(`houses w/ overdue: ${house.name}`);

//         const now = new Date();
//         const daysUntilSunday = (7 - now.getDay()) % 7;
//         const nextSundayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday);

//       // Send notifications, update choreStatus, or handle as needed
//     });
//     return null;
// });

/*async function assignUserstoHouse(houseId){
    try {
        
        const userRef = collection(db, "users");
        const houseRef = collection(db, "houses"); 

        houseQuery = query(houseRef, where("house", "==", houseId));
        //userQuery = query(userRef, where("house_id", "==", houseId));

        const houseCheck = await getDocs(houseQuery);
        const userCheck = await getDocs(userRef);

        const userIds = userCheck.docs.map((userDoc) => userDoc.id);
        const numUsers = userIds.length;
        const HouseIf = 
        //const numChores = choreCheck.size;

        if (numUsers === 0 || numChores === 0) {
            console.log("No users or chores available to assign.");
            return;
        }
        let userIndex = 0;
        for (const choreDoc of choreCheck.docs) {
            const choreId = choreDoc.id; // Chore document ID
            const choreData = choreDoc.data();

            const assignedUser = userIds[userIndex];
            console.log(`Assigning chore "${choreData.name}" to user "${assignedUser}"`);

            await updateDoc(doc(db, "chores", choreId), { choreUser: assignedUser });

            await updateDoc(doc(db, "users", assignedUser), 
                {choreAssigned: arrayUnion(choreId) });

            userIndex = (userIndex + 1) % numUsers;
        }
    } catch (error) {
        console.error("Error assigning chore to user! error: ", error);
    }
}*/

export {
  createHouse,
  inviteUserToHouse,
  verifyInvite,
  getHousemates,
  assignChorestoHouse,
  swapTimeChecker,
};
