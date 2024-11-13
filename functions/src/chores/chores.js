import { collection, addDoc, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

async function createChore(choreId, choreName, choreDue, roomId, choreStatus, choreLate, choreUserId, choreNotifId, HomeId, db) {
    try {
        const choreRef = doc(db, "chores", choreId.toString())
        // Add new house document to Firestore
        await setDoc(choreRef, {
            id: choreId,
            name: choreName || "Chore",
            dueDate: choreDueDate,
            roomId: [null],
            members: [null]
        });
        console.log("Room created successfully w/ id of ", roomId);
        
    } catch (error) {
        console.error("Error creating room! error: ", error);
    }
}

async function assignChoresToRoom(roomId, choreId, db) {
    try {
        const roomRef = doc(db, "rooms", roomId.toString());
        await updateDoc(roomRef, {
            chores: arrayUnion(choreId)
        });   
        console.log("chore (with id of: ", choreId, ") was successfully added into room (with id of: ", roomId);
    } catch (error) {
        console.error("Error adding chore to room! error: ", error);
    }
}

async function assignUser(roomId, userId, db) {
    try {
        // Update house document to add the user to the members array
        const roomRef = doc(db, "room", roomId);
        await updateDoc(roomRef, {
            members: arrayUnion(userId)
        });

        // Update the user profile with the house ID
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { room_id: roomId });

        console.log("User added to house");

    } catch (error) {
        console.error("Error joining house:", error);
    }
}

export { createRoom, assignChoresToRoom, assignUser };