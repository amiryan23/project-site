import {db,docId,firebaseConfig,storage} from './../firebase'
import { doc, updateDoc ,arrayUnion  } from "firebase/firestore";




export const addNotificationToUser = async (targetUserId,userId,postId,type ) => {
  try {

            const currentDate = new Date();
        const utcTimeAdded = currentDate.toISOString(); 
        
    const userDocRef = doc(db, "users", targetUserId);
    const notification = {
      type:type,
      fromUser:userId,
      postId:postId,
      timestamp: utcTimeAdded,
      read: false
    };
    await updateDoc(userDocRef, {
      notifications: arrayUnion(notification)
    });
    console.log("Notification added to user successfully.");
  } catch (error) {
    console.error("Error adding notification to user:", error);
  }
};