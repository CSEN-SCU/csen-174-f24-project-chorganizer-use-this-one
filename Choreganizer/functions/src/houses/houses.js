import { collection, addDoc, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../index.js";

async function createHouse(houseName, userId) {
    try {
        // Add new house document to Firestore
        const docRef = await addDoc(collection(db, "houses"), {
            name: houseName || "House",
            owner: userId,
            members: [userId],
            invitations: [null],
            invitationCodes: [null],
            rooms: [null]
        });
        await updateDoc(docRef, {id: docRef.id});
        console.log("Home created successfully");
        return ((await getDoc(docRef)).data());
        
    } catch (error) {
        console.error("Error creating house:", error);
    }
}

async function inviteUserToHouse(invitedEmails, ownerId) {
    try {
        invitedEmails.forEach(item => {
            const joinCode = Math.floor(1000 + Math.random() * 9000);
        })
        // Update house document to add the invitation to the invitations array
        const houseRef = doc(db, "houses", ownerId);
        await updateDoc(houseRef, {
            invitations: arrayUnion(invitedId)
        });
        
        // Send invitation email to the invited user
        // (You can use a library like "nodemailer" for sending emails)
        
    } catch (error) {
        console.error("Error inviting user to house:", error);
    }
}

async function verifyInvite(houseId, userId) {
    try {
        // Update house document to add the user to the members array
        const houseRef = doc(db, "houses", houseId);
        await updateDoc(houseRef, {
            members: arrayUnion(userId)
        });

        // Update the user profile with the house ID
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { house_id: houseId });

        console.log("User added to house");

    } catch (error) {
        console.error("Error joining house:", error);
    }
}

export { createHouse, inviteUserToHouse, verifyInvite };