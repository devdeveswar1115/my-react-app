import { db, storage } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { setDoc } from 'firebase/firestore';

const updateGlobalTimestamp = async () => {
  try {
    const docRef = doc(db, 'metadata', 'site_info');
    await setDoc(docRef, { lastUpdated: new Date() }, { merge: true });
  } catch (e) {
    console.error("Failed to update global timestamp:", e);
  }
};

// Add a document
export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date()
    });
    await updateGlobalTimestamp();
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (collectionName: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
    await updateGlobalTimestamp();
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    await updateGlobalTimestamp();
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

// Get all documents from a collection
export const getDocuments = async (collectionName: string) => {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

// Get a single document
export const getDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

