// // Export functions
// exports.createUser = auth.createUser;
// exports.createHouse = houses.createHouse;
// exports.addChore = chores.addChore;
// exports.rotateChores = chores.rotateChores;
// exports.sendNotification = notifications.sendNotification;
// exports.uploadProof = storage.uploadProof;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import addUser from "./auth/auth.js";
import {createRoom, assignChoresToRoom, assignUser } from "./rooms/rooms.js";
// import { signInWithGoogle, sendJoinCode } from './auth/auth.js';
// import { createHouse, inviteUserToHouse, joinHouse } from './houses/houses.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsqE8t5QnzfcQuSU2D2BKVGGOlIuj84Tk",
  authDomain: "chorganizer-29aa5.firebaseapp.com",
  projectId: "chorganizer-29aa5",
  storageBucket: "chorganizer-29aa5.appspot.com",
  messagingSenderId: "983388578449",
  appId: "1:983388578449:web:c3e858e05b17e81245d530",
  measurementId: "G-C5P42ZVWEE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// export default app;
addUser(auth, db);
const roomId = "bathroom"; const roomName = "bathroom"; const choreId = 1;
await createRoom(roomId, roomName, choreId, db);
await assignChoresToRoom(roomId, 2, db); 
await assignChoresToRoom(roomId, 4, db);
process.exit();
// signInWithGoogle(auth, db);
