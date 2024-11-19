import firebase from 'firebase/compat/app';
import { FirestoreDataConverter, QueryDocumentSnapshot } from "firebase/firestore"
export interface MessReportTemplate {
  id: string
  message: string | null
  createdAt: Date
  claimerUserId: string | null
  reporterUserId: string
}

export const MessReportConverter: FirestoreDataConverter<MessReportTemplate> = {
  toFirestore(mess: MessReportTemplate): firebase.firestore.DocumentData {
    return {
      claimerUserId: mess.claimerUserId,
      reporterUserId: mess.reporterUserId
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<firebase.firestore.DocumentData>, options: firebase.firestore.SnapshotOptions): MessReportTemplate {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      claimerUserId: data.claimerUserId,
      reporterUserId: data.reporterUserId,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      message: data.message,
    };
  }
};