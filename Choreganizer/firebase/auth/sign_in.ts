import {auth} from '../firebaseConfig';
import {createUserWithEmailAndPassword } from "firebase/auth";

export const SignUpNewUser = (email : string, password : string) => {
  createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log("user sign up succeeded", user)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    // ..
  });
};