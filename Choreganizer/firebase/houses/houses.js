import { collection, addDoc, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import * as functions from "firebase-functions";
import sgMail from "@sendgrid/mail";

async function createHouse(houseName) {
    try {
        const user = auth.currentUser;
        const docRef = await addDoc(collection(db, "houses"), {
            name: houseName || "House",
            head_user: user.uid,
            members: [user.uid],
            invitations: [null],
            invitationCodes: [null],
            rooms: [null]
        });
        await updateDoc(docRef, {id: docRef.id});
        console.log("Home created successfully");
        return (await docRef);
        
    } catch (error) {
        console.error("Error creating house:", error);
    }
}

sgMail.setApiKey(functions.config().sendgrid.key);
async function sendInvitationEmail(toEmail: string, joinCode: string) {
    try {
      const msg = {
        to: toEmail,
        from: "choreganizerapp@gmail.com",
        subject: "Join Your House!",
        html: `<p>Your one-time code is: <strong>${joinCode}</strong></p>`,
      };

      const result = await sgMail.send(msg);
      console.log("Email sent successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }

async function inviteUserToHouse(houseId, invitedEmails) {
    try {
        const houseRef = doc(db, "houses", houseId);
        const houseData = await getDoc(houseRef);
        if (!houseData.exists()) {
            throw new Error(`House with ID ${houseId} does not exist.`);
        }
        for (const invitee of invitedEmails) {
            const joinCode = Math.floor(1000 + Math.random() * 9000);
            await updateDoc(houseRef, {
                invitations: arrayUnion(invitee),
                invitationCodes: arrayUnion(joinCode)
            });
            await sendInvitationEmail(invitee, joinCode);
        }
    } catch (error) {
        console.error("Error inviting user to house:", error);
    }
}

async function verifyInvite(houseId, joinCode) {
    try {
        const user = auth.currentUser;
        const houseRef = doc(db, "houses", houseId);
        const houseData = await getDoc(houseRef);
        if (!houseData.exists()) {
            throw new Error(`House with ID ${houseId} does not exist.`);
        }
        const index = houseData.data().invitations.indexOf(user.email);
        if (joinCode === houseData.data().invitationCodes[index]) {
            houseData.data().invitations[index] = null;
            houseData.data().invitationCodes[index] = null;
            await updateDoc(houseRef, {
                members: arrayUnion(user.uid)
            });
        }
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { house_id: houseId });
        console.log("User added to house");
    } catch (error) {
        console.error("Error joining house:", error);
    }
}

async function getHousemates(houseId) {
    try {
        const houseRef = doc(db, "houses", houseId);
        const houseData = await getDoc(houseRef);
        if (!houseData.exists()) {
            throw new Error(`House with ID ${houseId} does not exist.`);
        }
        const members = houseData.data().members;
        const housemates = [];

        for (const memberId of members) {
            const userRef = doc(db, "users", memberId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                housemates.push(userDoc.data());
            } else {
                console.warn(`User with ID ${memberId} does not exist.`);
            }
        }
        return housemates;
    } catch (error) {
        console.error("Error getting housemates:", error);
    }
}

export { createHouse, inviteUserToHouse, verifyInvite, getHousemates };