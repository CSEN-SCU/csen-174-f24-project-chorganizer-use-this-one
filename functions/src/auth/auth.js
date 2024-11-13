import { collection, addDoc, setDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

async function signInWithGoogle(auth, db) {
    const provider = new GoogleAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log("User signed in:", user.displayName);

        // Save user data to Firestore
        await addDoc(collection(db, "users"), {
            id: user.uid,
            name: user.displayName,
            head_user: false,
            house_id: null,
            createdAt: new Date(),
            email: user.email,
            notification_id: null
        });

        console.log("User data saved to Firestore");

    } catch (error) {
        console.error("Error during sign-in:", error);
    }
}

async function addUser(auth, db) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export default addUser;
