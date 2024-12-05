import { collection, addDoc, doc, setDoc, query, where, getDocs, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {auth, db} from "./../firebaseConfig";

async function createRoom(roomName) {
    try {
        //const roomRef = doc(db, "rooms", roomId.toString())
        const roomRef = await addDoc(collection(db, "rooms"), {
            name: roomName,
            chores: [null],
            house: null,
        });
        console.log("room created successfully w/ id of ", roomRef.id);
        await updateDoc(roomRef, { id: roomRef.id });
        //return ((await getDoc(roomRef) ).data())
        
    } catch (error) {
        console.error("Error creating room! error: ", error);
    }
}

async function assignChorestoRooms(roomName, choreArray){
    try {
        const roomRef = collection(db, "rooms");
        const choreRef = collection(db, "chores");

        const choreCheck = await getDocs(choreRef);
        
        const roomQuery = query(roomRef, where("name", "==", roomName));
        const roomSnapshot = await getDocs(roomQuery);
        const roomDoc = roomSnapshot.docs[0];

        const choreDocs = [];

        for (let choreName of choreArray) {
            const choreQuery = query(choreRef, where("name", "==", choreName));
            const choreSnapshot = await getDocs(choreQuery);
            if (!choreSnapshot.empty) {
                choreDocs.push(choreSnapshot.docs[0].id);  // Push the ID of the chore document (or use the whole doc if needed)
            } else {
                console.log(`Chore "${choreName}" not found`);
            }
        }

        if (choreDocs.length > 0) {
            const roomDocRef = doc(db, "rooms", roomDoc.id); // Get the document reference for the room
            await updateDoc(roomDocRef, {
                chores: choreDocs  // Assign the chore IDs (or references) to the room
            });
            console.log("Chores assigned successfully to the room: ", roomName);
        } else {
            console.log("No valid chores to assign");
        }

        
    } catch (error) {
        console.error("Error assigning chore to room! error: ", error);
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

export { createRoom, assignChorestoRooms, assignUser };