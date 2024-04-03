import { Firestore, doc } from 'firebase/firestore';

// Define a function that creates a document reference
const createDocumentReference = (db: Firestore, collectionPath: string, documentId: string) => {
  return doc(db, collectionPath, documentId);
};

export default createDocumentReference;