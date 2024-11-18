import app from "../firebaseConfig";
import { getFirestore, collection, addDoc, query, where, getDoc, Firestore, QueryFieldFilterConstraint } from "firebase/firestore";
import { NotificationTemplate } from "../types/notification";
import firebase from "firebase/compat/app";

const notif_collection = collection(getFirestore(app), "notifications");

const notificationConverter = {
  /**
   * Converts a NotificationTemplate to a Firestore document data object.
   * @param notification - The NotificationTemplate object to convert.
   * @returns A Firestore document data object.
   */
  toFirestore(notification: NotificationTemplate): firebase.firestore.DocumentData {
    // Return an object representing the Firestore document
    return {
      title: notification.title, 
      body: notification.body, 
      receiverId: notification.receiverId, 
      bump: notification.bump,
      createdAt: notification.createdAt, 
      read: notification.read,
    };
  },

  /**
   * Converts a Firestore document snapshot to a NotificationTemplate object.
   * @param snapshot - The Firestore document snapshot to convert.
   * @param options - The snapshot options.
   * @returns A NotificationTemplate object.
   */
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>,
    options: firebase.firestore.SnapshotOptions): NotificationTemplate {
    const data = snapshot.data(options);
    return {
     id: snapshot.id,
      title: data.title || "",
      body: data.body || "",
      receiverId: data.receiverId || -1,
      bump: data.bump || false,
      createdAt: data.time.toDate() || new Date(),
      read: data.read || false
    };

  }
}

export function createNotification(title: string, body: string, receiverId: string, bump: boolean): NotificationTemplate {
  return {
    id: null,
    title: title,
    body: body,
    receiverId: receiverId,
    bump: bump,
    createdAt: new Date(),
    read: false
  }
}

export const addNotification = async (userData: Omit<NotificationTemplate, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(notif_collection, {
      ...userData,
      createdAt: new Date(), // Set standard field for creation timestamp
    });
    console.log('User added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

/**
 * Get all notifications for a given user.
 * @param user_id - The user ID for which we want to get all notifications.
 * @returns A list of NotificationTemplate objects, sorted by time in descending order.
 */
export const getNotificationByQuery = async (user_id: number, queries : QueryFieldFilterConstraint[]): Promise<NotificationTemplate[]> => {
  // Query the notifications collection for documents matching the user ID and read status
  const q = query(notif_collection,...queries, where("receiverId", "==", user_id));
  const notifList: NotificationTemplate[] = [];

  try {
    // Execute the query and get the documents
    const querySnapshot = await getDoc(q);

    // Iterate through each document in the snapshot
    querySnapshot.forEach((doc) => {
      // Convert the document data to a NotificationTemplate object and add it to the list
      notifList.push(doc.data().withConverter(notificationConverter));
      // notifList.push(notificationConverter.fromFirestore(doc, {}));
    });

    // Sort the notifications by creation time in descending order
    notifList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (e) {
    // Log any error that occurs during the query or conversion process
    console.error("Error getting document: ", e);
  }

  // Return the list of notifications
  return notifList;
}
export const getUnreadNotification = async (user_id: number): Promise<NotificationTemplate[]> => {
  return getNotificationByQuery(user_id, [where("read", "==", false)]);
}

export const getBumpNotification = async (user_id: number): Promise<NotificationTemplate[]> => {
  return getNotificationByQuery(user_id, [where("bump", "==", true)]);
}