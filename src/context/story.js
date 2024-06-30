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


export const ViewStoryFunction = async (userId, thisUser, usersArray, queryClient) => {
  try {
    const userStoryIndex = usersArray?.find(user => user.id === userId)?.storyArray.length - 1;
    const userStory = usersArray?.find(user => user.id === userId)?.storyArray[userStoryIndex];

    if (!userStory.view) {
      userStory.view = [];
    }

    if (!userStory.view.includes(thisUser?.id)) {
      userStory.view.push(thisUser?.id);

      // Обновляем только storyArray для пользователя
      const updatedStoryArray = [...usersArray.find(user => user.id === userId).storyArray];
      updatedStoryArray[userStoryIndex] = { ...userStory };

      await setDoc(doc(db, "users", userId), { storyArray: updatedStoryArray }, { merge: true });

      // Обновляем данные в кэше
      const updatedUser = { ...usersArray.find(user => user.id === userId), storyArray: updatedStoryArray };
      queryClient.setQueryData(['users', userId], updatedUser);

      console.log("Added View");
    }
  } catch (error) {
    console.error("Error adding view to story:", error);
  }
};






export const AddHighlightFunction = async (userId, storyId, usersArray, queryClient) => {
  try {
    const userIndex = usersArray.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const user = usersArray[userIndex];
    const storyIndex = user.storyArray.findIndex(story => story.id === storyId);
    if (storyIndex === -1) {
      throw new Error("Story not found");
    }

    const updatedStoryArray = [...user.storyArray];
    const updatedStory = { ...updatedStoryArray[storyIndex] };

    updatedStory.highlight = !updatedStory.highlight;
    updatedStoryArray[storyIndex] = updatedStory;

    await setDoc(doc(db, "users", userId), { storyArray: updatedStoryArray }, { merge: true });

  
    const updatedUser = { ...user, storyArray: updatedStoryArray };
    const updatedUsersArray = [...usersArray];
    updatedUsersArray[userIndex] = updatedUser;

    queryClient.setQueryData('users', updatedUsersArray);

    console.log("Toggled highlight");
  } catch (error) {
    console.error("Error toggling highlight:", error);
  }
};
