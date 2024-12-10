import {auth, db} from '../firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

/*export const SignUpNewUser = async (email : string, password : string) => {
  createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
    const user = userCredential.user;
    console.log("user sign up succeeded", user);
    //const docRef = doc(db, "users", user.uid);
    //await addDoc(collection(db, "users", user.uid), {
    const docRef = await addDoc(collection(db, "users"), {
      name: user.displayName,
      head_user: false,
      house_id: null,
      createdAt: new Date(),
      email: user.email,
      notifBool: true,
      notification_id: null,
      streak: 0
    });

    await updateDoc(docRef, {id: docRef.id});
    
    return ((await getDoc(docRef)).data());
  })*/
export const SignUpNewUser = async (email, password, displayName) => {
  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    console.log('User sign-up succeeded', user);

    if (displayName) {
      await updateProfile(user, {displayName});
    } //ADD SUMN HERE // Add the new user to the Firestore database

    const docRef = await addDoc(collection(db, 'users'), {
      name: displayName || 'Anonymous', // Use "Anonymous" if no display name
      head_user: false,
      house_id: null,
      createdAt: new Date(),
      email: user.email,
      notifBool: true,
      notification_id: null,
      streak: 0,
    }); // Update the document with its own ID

    await updateDoc(docRef, {id: docRef.id});
    await updateDoc(docRef, {uid: user.uid}); // Fetch and return the created user data

    const userData = (await getDoc(docRef)).data();
    return userData;
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error; // Re-throw the error for upstream handling
  }
};

/*
      })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
};*/

// export const SignInUser = (email: string, password: string) => {
//   signInWithEmailAndPassword(auth, email, password)
//     .then(async userCredential => {
//       const user2 = userCredential.user;
//       console.log('user sign in succeeded', user2);
//       const usersRef = collection(db, 'users');
//       const q = query(usersRef, where('id', '==', user2.uid));
//       const querySnapshot = await getDoc(q);

//       if (!querySnapshot.empty) {
//         const existingUserData = querySnapshot.docs[0].data();
//         if (existingUserData.house_id) {
//           console.log('User already has a house');
//           return {status: 'existingWithHouseId', user: user};
//         } else {
//           console.log('User exists but has no house');
//           return {status: 'existingNoHouseId', user: user};
//         }
//       }
//     })
//     .catch(error => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.error('Error signing in:', errorCode, errorMessage);
//     });
// };

// BEATRICE: make it so that it returns wehter or not they have a house or something??

export const SignInUser = async (email, password) => {
  try {
    // Sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    console.log('User sign-in succeeded', user); // Query the "users" collection for the signed-in user's data

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', user.uid)); // Use `uid` instead of `id`
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingUserData = querySnapshot.docs[0].data(); //its linking the house to the user, but not the user to the house
      if (existingUserData.house_id) {
        console.log('User already has a house');
        return {status: 'existingWithHouseId', user: existingUserData};
      } else {
        console.log('User exists but has no house');
        return {status: 'existingNoHouseId', user: existingUserData};
      }
    } else {
      console.error('No user found in Firestore for the signed-in user');
      return {status: 'notFoundInFirestore', user: null};
    }
  } catch (error) {
    console.error('Error signing in:', error.code, error.message);
    throw error; // Re-throw the error for upstream handling
  }
};

export const toggleNotifs = () => {
  try {
    const user = auth.currentUser;
    const docRef = doc(db, 'users', user.uid);
    const toggledVal = !docRef.data().notifBool;
    setDoc(docRef, {notifBool: toggledVal});
  } catch (error) {
    console.error('Error toggling notifications:', error);
  }
};

export const getUserInfo = async (userID) => {
  try {
    const userRef = collection(db, 'users'); //, user.uid);
    const userQuery = query(userRef, where('uid', '==', userID));
    const userCheck = await getDocs(userQuery);
    const correct = userCheck.docs[0];
    //console.log("666", correct.data());
    return correct.data();
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

export const getHouseIdByUser = (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    return getDoc(docRef).data().house_id;
  } catch (error) {
    console.error('Error getting house id by user:', error);
    throw error;
  }
};
/*import { auth, db } from '../firebaseConfig';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const SignUpNewUser = (email : string, password : string) => {
  createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
    const user = userCredential.user;
    console.log("user sign up succeeded", user);
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, {
      name: user.displayName,
      head_user: false,
      house_id: null,
      createdAt: new Date(),
      email: user.email,
      notifBool: true,
      notification_id: null,
      streak: 0
    });
    return ((await getDoc(docRef)).data());
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
};

export const SignInUser = (email : string, password : string) => {
  signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
    const user = userCredential.user;
    console.log("user sign in succeeded", user);
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("id", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingUserData = querySnapshot.docs[0].data();
      if (existingUserData.house_id) {
        console.log("User already has a house");
        return { status: "existingWithHouseId", user: user };
      } else {
        console.log("User exists but has no house");
        return { status: "existingNoHouseId", user: user };
      }
    }
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error signing in:", errorCode, errorMessage);
  });
};

export const toggleNotifs = () => {
  try {
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.uid);
    const toggledVal = !docRef.data().notifBool;
    setDoc(docRef, { notifBool: toggledVal });
  } catch (error) {
    console.error("Error toggling notifications:", error);
  }
};

export const getUserInfo = () => {
  try {
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.uid);
    return getDoc(docRef).data();
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error;
  }
};*/
