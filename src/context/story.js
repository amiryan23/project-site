import {db,storage,docId,firebaseConfig} from './../firebase'
import { doc, updateDoc,setDoc   } from "firebase/firestore";
import { ref, uploadBytes , getDownloadURL } from "firebase/storage";
import Resizer from 'react-image-file-resizer';



export const AddStoryFunction = async (thisUser, fileUrl , storyText ,queryClient) => {
  try {
          
          
       const file = fileUrl?.file;

          const compressedFile = await new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            file.width, 
            file.height, 
            'JPEG', 
            50, 
            0, 
            (uri) => {
              resolve(uri);
            },
            'file'
          );
        });

        const timestamp = new Date().getTime();
        const uniqueFilename = `post_${timestamp}_${file.name}`;

    if (!thisUser.storyArray) {
      thisUser.storyArray = [];
    }

    const storageRef = ref(storage, `StoryStorage/${uniqueFilename}`);

    
    await uploadBytes(storageRef, compressedFile);

    const downloadURL = await getDownloadURL(storageRef);

    const newStory = {
      id: new Date().getTime(),
      userId: thisUser?.id,
      fileURL: fileUrl ? downloadURL : false,
      timeAdded: new Date().toLocaleString(),
      storyText:storyText
    };

    
    thisUser.storyArray.push(newStory);

    
    await setDoc(doc(db, "users", thisUser.id), { storyArray: thisUser.storyArray }, { merge: true });

    
    const newThisUser = { ...thisUser, storyArray: thisUser.storyArray };
    queryClient.setQueryData(['users', thisUser.id], newThisUser);

    console.log("Новый объект успешно добавлен в Firestore.");
  } catch (error) {
    console.error("Ошибка при добавлении новой истории:", error);
  }
};

export const DeleteStoryFunction = async (idToDelete, thisUser, queryClient) => {
  try {
    
    const newArrayStories = thisUser?.storyArray.filter(story => story.id !== idToDelete);

   
    thisUser.storyArray = newArrayStories;

   
    await setDoc(doc(db, "users", thisUser.id), { storyArray: newArrayStories }, { merge: true });

   
    const newThisUser = { ...thisUser, storyArray: newArrayStories };
    queryClient.setQueryData(['users', thisUser.id], newThisUser);

    console.log("История успешно удалена из массива и из Firestore.");
  } catch (error) {
    console.error("Ошибка при удалении истории:", error);
  }
};