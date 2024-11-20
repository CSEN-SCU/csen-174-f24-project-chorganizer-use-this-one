import { collection, addDoc, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
//import { auth, db } from "./index.js";
import {auth, db} from "./../firebaseConfig";
//import nodemailer from 'nodemailer';

async function createHouse(houseName) {
    try {
        const user = auth.currentUser;
        const docRef = await addDoc(collection(db, "houses"), {
            name: houseName || "House",
            head_user: user.uid || null,
            members: [user.uid] || null,
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

async function sendInvitationEmail(toEmail, textContent) {
    // Create a transporter using SMTP settings
    let transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this to your email provider (e.g., 'hotmail', 'outlook')
        auth: {
            user: 'chorganizerapp@gmail.com', // Your email
            pass: 'CSEN174project',   // Your email password (or app password if 2FA is enabled)
        },
    });

    // Define email options
    let mailOptions = {
        from: '"Chorganizer" <chorganizerapp@gmail.com>', // sender address
        to: toEmail, // recipient address
        subject: "Join Your House!", // Subject line
        text: "Your one time code is: \n${textContent}", // plain text body
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Invitation email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending invitation email: ', error);
    }
}

async function inviteUserToHouse(houseId, invitedEmails) {
    try {
        const houseRef = doc(db, "houses", houseId);
        const houseData = await getDoc(houseRef);
        if (!houseData.exists()) {
            throw new Error(`House with ID ${houseId} does not exist.`);
        }
        for (const item of invitedEmails) {
            const joinCode = Math.floor(1000 + Math.random() * 9000);
            await updateDoc(houseRef, {
                invitations: arrayUnion(item),
                invitationCodes: arrayUnion(joinCode)
            });
            //await sendInvitationEmail(item, joinCode);
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