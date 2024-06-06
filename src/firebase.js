 import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc , getDocs , updateDoc , FieldValue } from "firebase/firestore";
import { getStorage,ref, uploadBytes } from "firebase/storage";
import { getAuth , onAuthStateChanged } from "firebase/auth";



 export const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY ,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId:process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MSG_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUR_ID
};

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const docId = process.env.REACT_APP_DOC_ID;
export const updatesDocId = process.env.REACT_APP_UPDATES_DOC_ID