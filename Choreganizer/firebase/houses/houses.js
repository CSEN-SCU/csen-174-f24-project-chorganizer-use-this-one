import { collection, addDoc, getDoc, getDocs, doc, updateDoc, arrayUnion, query, where } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

// Create a new house
async function createHouse(houseName) {
    try {
        const user = auth.currentUser;
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', user?.uid));
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs[0].data();
        const userRef = querySnapshot.docs[0].ref;
        const docRef = await addDoc(collection(db, "houses"), {
            name: houseName || "House",
            members: [],
            invitations: [],
            invitationCodes: [],
            rooms: [],
        });
        await updateDoc(docRef, { id: docRef.id });
        await updateDoc(docRef, { head_user: userData.id });
        await updateDoc(docRef, { members: arrayUnion(userData.id) });
        console.log("House created successfully with docRef of ", docRef);

        await updateDoc(userRef, {house_id: docRef.id});
        return (await getDoc(docRef)).data();
    } catch (error) {
        console.error("Error creating house:", error);
        throw error;
    }
}

async function inviteUserToHouse(houseId, invitedEmails) {
    try {
        const houseRef = doc(db, "houses", houseId);
        const houseSnap = await getDoc(houseRef);

        if (!houseSnap.exists()) {
            throw new Error(`House with ID ${houseId} does not exist.`);
        }

        const houseData = houseSnap.data();
        const sendEmailNotification = httpsCallable(functions, 'sendEmailNotification');
        for (const invitee of invitedEmails) {
            const joinCode = Math.floor(1000 + Math.random() * 9000);

            console.log("Updating Firestore for invitee:", invitee);
            // Update Firestore with invitation data
            await updateDoc(houseData.ref, {
                invitations: arrayUnion(invitee),
                invitationCodes: arrayUnion(joinCode),
            });
            console.log("Firestore updated successfully for:", invitee);
            const emailText = 'Your join code is: ${joinCode}';
            // Send email notification
            await sendEmailNotification({ to: invitee, subject: "Join Your House!", text: emailText });

            console.log(`Email sent to ${invitee}:`, result.data);
        }
    } catch (error) {
        console.error("Error inviting user to house:", error);
    }
}

// Verify invitation
async function verifyInvite(houseId, joinCode) {
    try {
        const user = auth.currentUser;
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', user?.uid));
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs[0].data();
        const userRef = querySnapshot.docs[0].ref;
        const houseRef = doc(db, "houses", houseId);
        const houseData = await getDoc(houseRef);

        if (!houseData.exists()) {
            throw new Error(`House with ID ${houseId} does not exist.`);
        }

        const data = houseData.data();
        const index = data.invitations.indexOf(userData.email);

        if (index >= 0 && data.invitationCodes[index] === joinCode) {
            // Update Firestore with new member and clear invitation
            await updateDoc(houseRef, {
                members: arrayUnion(userData.id),
                invitations: data.invitations.filter((_, i) => i !== index),
                invitationCodes: data.invitationCodes.filter((_, i) => i !== index),
            });

            // Link the user to the house in Firestore
            await updateDoc(userRef, { house_id: houseId });

            console.log("User successfully added to house");
        } else {
            throw new Error("Invalid join code or email not invited.");
        }
    } catch (error) {
        console.error("Error verifying invite:", error);
    }
}

// Get housemates
async function getHousemates(houseId) {
    try {
        const houseRef = doc(db, "houses", houseId);
        const houseData = await getDoc(houseRef);

        if (!houseData.exists()) {
            throw new Error(`House with ID ${houseId} does not exist.`);
        }

        const members = houseData.data().members;

        // Fetch all housemates concurrently
        const housemates = await Promise.all(
            members.map(async (memberId) => {
                const userRef = doc(db, "users", memberId);
                const userDoc = await getDoc(userRef);
                return userDoc.exists() ? userDoc.data() : null;
            })
        );

        return housemates.filter(Boolean); // Remove null values
    } catch (error) {
        console.error("Error getting housemates:", error);
    }
}

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

export { createHouse, inviteUserToHouse, verifyInvite, getHousemates };