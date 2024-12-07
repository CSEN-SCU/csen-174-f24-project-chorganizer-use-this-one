import { db } from '../firebaseConfig';
import { collection, addDoc, doc, updateDoc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { MessReportTemplate, MessReportConverter } from '../types/mess';


const getHouseByUserId = async(userId: string) => {
    try {
    const userDoc = await getDoc(doc(db, `users/${userId}`));
    if (!userDoc.exists()) {
      throw new Error("No such user");
    }
    return userDoc.data().house_id
    } catch (e) {
      console.error("Error getting document: ", e);
      throw e;
    }
  }
export const reportMess = async (reporterUserId: string, message: string | null) => {
    const home_id = getHouseByUserId(reporterUserId);
    const messesCollectionRef = collection(db, `houses/${home_id}/messes`);
    const docRef = doc(messesCollectionRef);
    const mess: MessReportTemplate = { id: docRef.id, message: message, createdAt: new Date(), claimerUserId: null, reporterUserId: reporterUserId }
    try {
        await setDoc(docRef, mess);
        console.log('Mess added with ID:', docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

export const claimMess = async (mess_id: string, claimerUserId: string) => {
    const home_id = getHouseByUserId(claimerUserId);
    console.log(home_id, claimerUserId)
    const docRef = doc(collection(db, `houses/${home_id}/messes`), mess_id);
    try {
        await updateDoc(docRef, {
            claimerUserId: claimerUserId,
        });
        console.log('Mess claimed with ID:', mess_id);
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

export const getAllMessReports = async (user_id: string): Promise<MessReportTemplate[]> => {
    const home_id = getHouseByUserId(user_id);
    const messesCollectionRef = collection(db, `houses/${home_id}/messes`).withConverter(MessReportConverter);

    // Fetch all reported messes for this home
    const messesSnapshot = await getDocs(messesCollectionRef);

    const messes = messesSnapshot.docs.map(doc => doc.data());
    return messes
}
export const getMessReport = async (user_id: string, mess_id: string): Promise<MessReportTemplate> => {
    const home_id = getHouseByUserId(user_id);
    const messRef = doc(db, `houses/${home_id}/messes/${mess_id}`).withConverter(MessReportConverter);
    try {
        const mess = await getDoc(messRef);
        if (!mess.exists()) {
            throw new Error("No such mess");
        }
        return mess.data();
    } catch (e) {
        console.error("Error getting document: ", e);
        throw e;
    }
}