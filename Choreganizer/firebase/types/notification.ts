import { FirestoreDataConverter } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { QueryDocumentSnapshot } from "firebase/firestore";

export enum NotificationTag {
    MESS = "Mess",
    REMINDER = "Reminder",
    BUMP = "Bump",
    ACHEIVEMENT = "Achievement"
}
export interface NotificationTemplate {
    id: string;
    title: string;
    body: string;
    tag: NotificationTag;
    receiverId: string;
    read : boolean;
    choreId: string;
    createdAt: Date;
}

export const NotificationConverter: FirestoreDataConverter<NotificationTemplate> = {
    toFirestore(notification: NotificationTemplate): firebase.firestore.DocumentData {
      return {
        title: notification.title,
        body: notification.body,
        tag: notification.tag,
        choreId: notification.choreId,
        receiverId: notification.receiverId,
        read: notification.read,
        createdAt: notification.createdAt
      }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot<firebase.firestore.DocumentData>, options: firebase.firestore.SnapshotOptions): NotificationTemplate {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            title: data.title,
            body: data.body,
            tag: data.tag,
            receiverId: data.receiverId,
            read: data.read,
            choreId: data.choreId,
            createdAt: data.createdAt?.toDate() ?? new Date(),
        };
      }
  };