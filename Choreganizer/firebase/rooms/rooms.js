import { collection, addDoc, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

async function createChore(choreName, choreDue, houseId, roomId, choreStatus, choreUserId, choreNotifId, db) {
    try {
        //const choreRef = doc(db, "chores", choreId.toString())
        // Add new house document to Firestore
        const choreRef = await addDoc(collection(db, "chores"), {
            name: choreName,
            dueDate: choreDue || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            house: houseId,
            roomId: null,
            choreStatus: choreStatus || false,
            choreUser: choreUserId,
            choreNotifId: [choreNotifId]
            //chores: [null]
        });
        console.log("Chore created successfully w/ id of ", choreRef.id);
        await updateDoc(choreRef, { id: choreRef.id });
        return ((await getDoc(choreRef) ).data())
    } catch (error) {
        console.error("Error creating chore! error: ", error);
    }
}
async function assignChorestoUsers(choreId, userId, db){
    try {
        const userRef = doc(db, "users", userId.toString());
        const choreRef = doc(db, "chores", choreId.choreId);
        const choreCheck = await getDoc(choreRef);
        const choreData = choreCheck.data();

        const userCheck = await getDoc(userRef);
        const userData = userCheck.data();
        const numUsers = userData.userId.length();
        const numChores = choreData.cho
        await updateDoc(choreRef, {
            assignedUser: userId
        });   
        await updateDoc(userRef, {
            assignedChore : arrayUnion(choreId )
        });
        console.log("chore (with id of: ", choreId, ") was successfully assigned to user (with id of: ", userId);
    } catch (error) {
        console.error("Error assigning chore to user! error: ", error);
    }
}

async function checkDueDate(choreId, db){
    try {
        const choreRef = doc(db, "chores", choreId.choreId);
        const choreCheck = await getDoc(choreRef);
        const choreData = choreCheck.data();
        const currDate = new Date();

        if((choreData.dueDate && choreData.dueDate.toDate() <= currDate) || choreData.choreStatus == false){
            return (false); // either chore is due now, or over due, return false (status == bad)
        } else {
            return (true);
        }
    } catch (error) {
        console.error("Error assigning chore to user! error: ", error);
        return false;
    }
}

async function bumpChore(choreId, choreUserId, db){
    //unknown!! need Eerina's notif backend stuff still!
}

async function updateStatus(choreId, db){
    const choreRef = doc(db, "chores", choreId.choreId);
    const choreCheck = await getDoc(choreRef);
    const choreData = choreCheck.data();
    await updateDoc(choreRef, {
        choreStatus: !(choreData.choreStatus)
    });
}

export { createChore, assignChorestoUsers, checkDueDate, updateStatus };