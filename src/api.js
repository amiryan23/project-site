import {db,docId,auth,musicDocId} from './firebase'
import { collection, doc, getDoc , getDocs   } from "firebase/firestore";
import {  onAuthStateChanged } from "firebase/auth";



export const fetchData = async () => {
      try {
        const docRef = doc(db, "posts", docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data().arrayPosts;
          
        } else {
          console.log("Документ не найден");
        }
      } catch (error) {
        console.error("Ошибка при получении данных из Firestore:", error);
      }
    };


export  const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
      } catch (error) {
        console.error("Ошибка при получении пользователей из Firestore:", error);
      }
    };


export const fetchThisUser = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const userRef = doc(db, "users", uid);
        getDoc(userRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              resolve(docSnap.data());
            } else {
              console.log("Данные пользователя не найдены");
              resolve(null);
            }
          })
          .catch((error) => {
            console.error("Ошибка при получении данных о пользователе из Firestore:", error);
            reject(error);
          });
      } else {
        resolve(null); // Пользователь не авторизован
      }
    });
  });
};


export const fetchMusic = async () => {
 try{
  const docRef = doc(db, "musics", musicDocId);
  const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
          return docSnap.data().musicsArray;
          
        } else {
          console.log("Документ не найден");
        }
 }catch (error){
  console.error("Ошибка при получении данных из Firestore:", error)
 }
}