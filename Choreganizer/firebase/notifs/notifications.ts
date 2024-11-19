import {db} from "../firebaseConfig";
import {collection, addDoc, query, where, getDocs, CollectionReference, doc, QueryFieldFilterConstraint, getDoc, setDoc, updateDoc, onSnapshot, or } from "firebase/firestore";
import { NotificationTemplate, NotificationConverter, NotificationTag } from "../types/notification";

const getHomeByUserId = (userId: string) => {
  return "2wlomYWcIVmzftBnGDwi";
}

export function getNotificationCollection(user_id : string): CollectionReference<NotificationTemplate> {
  return collection(db, `users/${user_id}/notifications`).withConverter(NotificationConverter);
}

export const addNotification = async (data: NotificationTemplate): Promise<string> => {
  try {
    const collectionRef = await getNotificationCollection(data.receiverId);
    const docRef = await addDoc(collectionRef, data);
    console.log('Notification added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

/**
 * Add a notification to each member of the home when a new mess is reported
 * @param user_id The user_id of the user who reported the mess
 * @param mess_id The id of the mess that was reported
 * @param report_text The text of the report
 * @returns The id of the notification that was added for the requesting user, or null if an error occurred
 */
export const addMessNotification = async (user_id: string, mess_id: string, report_text: string): Promise<string | null> => {
  let docRef_id : string | null = null
  try {
    // Get the home document
    const home_id = getHomeByUserId(user_id);
    const home_docRef = await getDoc(doc(db, `houses/${home_id}`));

    if (!home_docRef.exists()) {
      throw new Error("No such home");
    }

    // Get the members of the home
    const members = home_docRef.data().members;

    // Add a notification for each member
    for (const member_id of members) {
      const collectionRef = getNotificationCollection(member_id);
      const docRef = doc(collectionRef);

      // Create the notification data
      const notification: NotificationTemplate = {
        id: docRef.id,
        tag: NotificationTag.MESS,
        choreId: mess_id, 
        title: "New Mess Report",
        body: report_text,
        receiverId: member_id,
        read: false,
        createdAt: new Date(),
      };

      // Add the notification
      await setDoc(docRef, notification);
      docRef_id = docRef.id;
      console.log('Successfully added notification with ID:', docRef.id);
    }
  } catch (e) {
    console.error("Error getting document: ", e);
  }
  return docRef_id
}

/**
 * Listens for unread notifications of a user in real-time and updates the provided state.
 * 
 * @param userId - The user's ID to listen for notifications.
 * @param setNotifications - A callback function to update the notification state.
 * @returns A function to unsubscribe from the real-time listener.
 */
export function listenForUnreadNotifications(userId: string, setNotifications: (notifications: NotificationTemplate[]) => void) {

  // Reference to the user's notifications collection
  const notificationsRef = getNotificationCollection(userId);

  // Query to filter unread notifications
  const unreadQuery = query(notificationsRef, where("read", "==", false));

  // Set up a real-time listener for unread notifications
  const unsubscribe = onSnapshot(unreadQuery, (snapshot) => {
    // Map the snapshot to an array of unread notifications
    const unreadNotifications = snapshot.docs.map((doc) => (doc.data()));

    console.log("Real-time Unread Notifications:", unreadNotifications);

    // Update the notification state with the unread notifications
    setNotifications(unreadNotifications);
  });

  // Return the unsubscribe function to stop listening later
  return unsubscribe;
}

/**
 * Marks a notification as read for a specific user.
 *
 * @param user_id - The ID of the user whose notification needs to be marked as read.
 * @param notification_id - The ID of the notification to be marked as read.
 */
export const markNotificationAsRead = async (user_id: string, notification_id: string) => {
  try {
    // Get the notifications collection reference for the user
    const notif_collection = getNotificationCollection(user_id);
    
    // Reference to the specific notification document
    const docRef = doc(notif_collection, notification_id);
    
    // Update the notification document to mark it as read
    await updateDoc(docRef, {
      read: true
    });

    console.log("Notification marked as read");
  } catch (e) {
    console.error("Error getting document: ", e);
  }
}
