import { collection, addDoc, doc, setDoc, query, where, getDocs, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {auth, db} from "./../firebaseConfig";

async function createChore(choreName, choreDue, houseId, roomId, choreStatus, choreUserId, choreNotifId) {
    try {
        const choreRef = await addDoc(collection(db, "chores"), {
            name: choreName,
            dueDate: choreDue || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            house: houseId,
            roomId: roomId || null,
            choreStatus: choreStatus || false,
            choreUser: choreUserId || null,
            choreNotifId: [choreNotifId]
        });
        console.log("Chore created successfully w/ id of ", choreRef.id);
        await updateDoc(choreRef, { id: choreRef.id });

        //return ((await getDoc(choreRef) ).data())
    } catch (error) {
        console.error("Error creating chore! error: ", error);
    }
}

async function assignChorestoUsers(houseId){
    try {
        
        const userRef = collection(db, "users");
        const choreRef = collection(db, "chores"); 

        choreQuery = query(choreRef, where("house", "==", houseId));
        userQuery = query(userRef, where("house_id", "==", houseId));

        const choreCheck = await getDocs(choreQuery);
        const userCheck = await getDocs(userQuery);

        const userIds = userCheck.docs.map((userDoc) => userDoc.id);
        const numUsers = userIds.length;
        const numChores = choreCheck.size;

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
}

async function checkDueDate(choreId, db){
    try {
        const choreRef = doc(db, "chores", choreId);
        const choreCheck = await getDocs(choreRef);
        const choreData = choreCheck.data();
        const currDate = new Date();

        if((choreData.dueDate.toDate() <= currDate) || choreData.choreStatus == true){
            console.log("chore is not due yet, returning false!");
            return (false); 
        } else {
            console.log("chore is due AND isn't done yet! returning true!");
            return (true);
        }
    } catch (error) {
        console.error("Error checking due date! error: ", error);
        return false;
    }
}

async function bumpChore(choreId, choreUserId, db){
    //unknown!! need Eerina's notif backend stuff still!
}

async function updateStatus(choreName, db){
    const choreRef = collection(db, "chores");
    const choreQuery = query(choreRef, where("name", "==", choreName));
    const choreSnapshot = await getDocs(choreQuery);
    const choreDoc = choreSnapshot.docs[0];
    //await updateDoc(choreRef, {
    //    choreStatus: !(choreData.choreStatus)
    //});

    const choreDocRef = doc(db, "rooms", choreDoc.id); // Get the document reference for the room
    await updateDoc(choreDocRef, {
        choreStatus: !(choreData.choreStatus)  
    });
    console.log("chore: ", choreName, " was toggled!!");
    
    /*const choreRef = doc(db, "chores", choreId.choreId);
    const choreCheck = await getDoc(choreRef);
    const choreData = choreCheck.data();
    await updateDoc(choreRef, {
        choreStatus: !(choreData.choreStatus)
    });*/
}

async function getXUsersChoreData(userId){

   

    const userRef = collection(db, "users");//, user.uid);
    userQuery = query(userRef, where("uid", "==", userId));
    const userCheck = await getDocs(userQuery);
    const correct = userCheck.docs[0].id;

    const choreRef = collection(db, "chores");
    const choreQuery = query(choreRef, where("choreUser", "==", correct));
    const choreSnapshot = await getDocs(choreQuery);
    //const justChoreNamesArray = choreSnapshot.data();
    //const justNames = justChoreNamesArray.name;
    const justChoreNamesArray = choreSnapshot.docs.map(doc => doc.data().name);
    
    console.log(correct, " user's chores r these: ", justChoreNamesArray);
    return (justChoreNamesArray);
}

export { createChore, assignChorestoUsers, checkDueDate, updateStatus, getXUsersChoreData };
