import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../index.js";

async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log("User signed in:", user.displayName);

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("id", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const existingUserData = querySnapshot.docs[0].data();            
            if (existingUserData.house_id) {
                // User already has a house
                console.log("User already has a house");
                return { status: "existingWithHouseId", user: user };
            } else {
                // User exists but doesn't have a home_id
                console.log("User exists but has no house");
                return { status: "existingNoHouseId", user: user };
            }
        } else {
            // If the user does not exist, add them to Firestore
            await addDoc(usersRef, {
                id: user.uid,
                name: user.displayName,
                head_user: false,
                house_id: null,
                createdAt: new Date(),
                email: user.email,
                notification_id: null,
                streak: 0
            });

            console.log("New user data saved to Firestore");
            return { status: "new", user: user };
        }

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

export { signInWithGoogle };
