import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
//import { signInWithGoogle } from "./auth/auth.js";
import { createHouse } from './houses/houses.js'; //, inviteUserToHouse, verifyInvite } from './houses/houses.js';
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

// createHouse("test1", 4);

export { auth, db, createHouse}//, inviteUserToHouse, verifyInvite};




/*const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Import functions
const auth = require('../../functions/src/auth/auth');
const houses = require('./houses/houses');
const chores = require('../../functions/src/chores/chores');
const notifications = require('./notifications/notifications');
const storage = require('../../functions/src/storage/storage');

// Export functions
exports.createUser = auth.createUser;
exports.createHouse = houses.createHouse;
exports.addChore = chores.addChore;
exports.rotateChores = chores.rotateChores;
exports.sendNotification = notifications.sendNotification;
exports.uploadProof = storage.uploadProof;*/