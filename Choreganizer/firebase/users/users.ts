import { auth, db } from '../firebaseConfig';
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
};