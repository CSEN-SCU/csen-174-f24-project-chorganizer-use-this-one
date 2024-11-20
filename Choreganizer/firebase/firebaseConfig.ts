import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { SignUpNewUser, SignInUser, toggleNotifs, getUserInfo } from "./users/users";
import { createHouse, inviteUserToHouse, verifyInvite, getHousemates } from './houses/houses.js';
import { createChore, assignChorestoUsers, checkDueDate, updateStatus } from './chores/chores.js';

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

export { app, auth, db, SignUpNewUser, SignInUser, getUserInfo, createHouse, inviteUserToHouse, verifyInvite, getHousemates, toggleNotifs, createChore, assignChorestoUsers, checkDueDate, updateStatus };