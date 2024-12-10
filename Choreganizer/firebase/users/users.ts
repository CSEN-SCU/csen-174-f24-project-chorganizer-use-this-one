import {auth, db} from '../firebaseConfig';
import {
  collection,
  doc,
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
      uid: user.uid,
    }); // Update the document with its own ID

    await updateDoc(docRef, {id: docRef.id});

    const userData = (await getDoc(docRef)).data();
    return userData;
  } catch (error) {
    console.error('Error signing up user:', error);
    throw error; // Re-throw the error for upstream handling
  }
};

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
    const q = query(usersRef, where('uid', '==', user?.uid)); // Use `uid` instead of `id`
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
    throw error;
  }
};

export const toggleNotifs = async () => {
  try {
    const user = auth.currentUser;
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', user?.uid));
    const querySnapshot = await getDocs(q);
    const userData = querySnapshot.docs[0].data();
    const userRef = querySnapshot.docs[0].ref;
    await updateDoc(userRef, {notifBool: !userData.notifBool});
  } catch (error) {
    console.error('Error toggling notifications:', error);
  }
};

export const getUserInfo = async (userID) => { // takes uid
  try {
    const userRef = collection(db, 'users');
    const userQuery = query(userRef, where('uid', '==', userID));
    const userCheck = await getDocs(userQuery);
    const correct = userCheck.docs[0];
    return correct.data();
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

export const getHouseIdByUser = async (userId: string) => { // takes id
  try {
    const docRef = doc(db, 'users', userId);
    const query = await getDoc(docRef);
    return query.data()?.house_id;
  } catch (error) {
    console.error('Error getting house id by user:', error);
    throw error;
  }
};
