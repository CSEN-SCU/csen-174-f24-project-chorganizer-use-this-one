import {auth, db} from '../firebaseConfig';
import {doc, setDoc} from 'firebase/firestore';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const SignUpNewUser = async (email : string, password : string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      houseId: null
    });
  } catch (error) {
    console.log(error);
  }
};

export const SignInUser = (email : string, password : string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("user sign in succeeded", user)
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ..
    });
};