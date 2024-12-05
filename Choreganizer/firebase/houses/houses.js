import { collection, addDoc, getDoc, getDocs, doc, updateDoc, arrayUnion, query, where } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

// Create a new house
async function createHouse(houseName) {
    try {
        const user = auth.currentUser;
        const docRef = await addDoc(collection(db, "houses"), {
            name: houseName || "House",
            head_user: user.uid,
            members: [user.uid],
            invitations: [],
            invitationCodes: [] || null,
            rooms: [],
        });
        await updateDoc(docRef, { id: docRef.id });
        console.log("House created successfully with docRef of ", docRef);
        return (await getDoc(docRef)).data();
    } catch (error) {
        console.error("Error creating house:", error);
        throw error;
    }
}

// Invite users to a house
// async function inviteUserToHouse(houseId, invitedEmails) {
//     try {
//         //console.log("the house id is, ", houseId);
//         const houseRef = collection(db, "houses");
//         const houseQuery = query(houseRef, where("id", "==", houseId))
//         const houseData1 = await getDocs(houseQuery);

//         if (houseData1.empty) {
//             throw new Error(`House with ID ${houseId} does not exist.`);
//         }

//         const houseData = houseData1.docs[0];

//         if (!houseData.exists()) {
//             throw new Error(`House with ID ${houseId} does not exist.`);
//         }

//         console.log("HIII", invitedEmails);
//         const sendEmail = httpsCallable(functions, "sendEmail");

//         for (const invitee of invitedEmails) {
//             const joinCode = Math.floor(1000 + Math.random() * 9000);

//             // Update Firestore with invitation data
//             await updateDoc(houseRef, {
//                 invitations: arrayUnion(invitee),
//                 invitationCodes: arrayUnion(joinCode),
//             });

//             // Call the Cloud Function to send an email
//             const result = await sendEmail({
//                 email: invitee,
//                 joinCode: joinCode,
//             });

//             console.log(`Email sent to ${invitee}:`, result.data);
//         }
//     } catch (error) {
//         console.error("Error inviting user to house:", error);
//     }
// }
async function inviteUserToHouse(houseId, invitedEmails) {
    try {
        const houseRef = collection(db, "houses");
        const houseQuery = query(houseRef, where("id", "==", houseId));
        const houseData1 = await getDocs(houseQuery);

        if (houseData1.empty) {
            throw new Error(`House with ID ${houseId} does not exist.`);
        }

        const houseData = houseData1.docs[0]; // First document
        
        console.log("2", houseData.data()); //this works!

        const sendEmail = httpsCallable(functions, "sendEmail");

        console.log("here!");

        for (const invitee of invitedEmails) {
            const joinCode = Math.floor(1000 + Math.random() * 9000);

            console.log("Updating Firestore for invitee:", invitee);
            // Update Firestore with invitation data
            await updateDoc(houseData.ref, {
                invitations: arrayUnion(invitee),
                invitationCodes: arrayUnion(joinCode),
            });
            console.log("Firestore updated successfully for:", invitee);

            // Call the Cloud Function to send an email
            const result = await sendEmail({
                email: invitee,
                joinCode: joinCode,
            });

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
        const houseRef = doc(db, "houses", houseId);
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
            });

            // Link the user to the house in Firestore
            const userRef = doc(db, "users", user.uid);
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

export { createHouse, inviteUserToHouse, verifyInvite, getHousemates };
