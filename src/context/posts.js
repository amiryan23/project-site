import {db,storage,docId,firebaseConfig} from './../firebase'
import { doc, updateDoc,setDoc   } from "firebase/firestore";
import { ref, uploadBytes , getDownloadURL } from "firebase/storage";
import imageCompression from 'browser-image-compression';
import Resizer from 'react-image-file-resizer';
import {addNotificationToUser} from './../helper/addNotification'



export const addPostFunction = async ( thisUser, postText, fileUrl, fileRef, forwardPost, tagged, trackId, arrayPosts, queryClient ) => {
  try {
    const currentDate = new Date();
    const utcTimeAdded = currentDate.toISOString();

    if (fileUrl) {
      const file = fileRef.current.files[0];
      const timestamp = new Date().getTime();
      const uniqueFilename = `post_${timestamp}_${file.name}`;
      
      let storageRef;
      let imageURL = "";
      let videoURL = "";

      // Проверяем тип файла: изображение или видео
      if (file.type.startsWith("image/")) {
        // Если это изображение, сжимаем его и загружаем
        const compressedFile = await new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            file.width, 
            file.height, 
            'JPEG', 
            60, 
            0, 
            (uri) => {
              resolve(uri);
            },
            'file'
          );
        });

        storageRef = ref(storage, `imagePosts/${uniqueFilename}`);
        await uploadBytes(storageRef, compressedFile);
        imageURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/imagePosts%2F${encodeURIComponent(uniqueFilename)}?alt=media`;
      } else if (file.type.startsWith("video/")) {
        // Если это видео, загружаем его без сжатия
        storageRef = ref(storage, `videoPosts/${uniqueFilename}`);
        await uploadBytes(storageRef, file);
        videoURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/videoPosts%2F${encodeURIComponent(uniqueFilename)}?alt=media`;
      }

      const newPost = { 
        id: new Date().getTime(), 
        user: thisUser.username,
        userId: thisUser.id,
        postText: postText,
        likes: [],
        dislikes: [],
        commentArray: [],
        imageURL: imageURL,
        videoURL: videoURL,
        timeAdded: utcTimeAdded,
        forwardPost: forwardPost !== null ? forwardPost : "",
        taggedUser: tagged,
        trackId: trackId
      };

      const newPostArray = [...arrayPosts, newPost];
      queryClient.setQueryData('arrayPosts', newPostArray);
      await setDoc(doc(db, "posts", docId), { arrayPosts: newPostArray });
      console.log("Новый объект успешно добавлен в Firestore.");
      
      if (tagged) {
        addNotificationToUser(tagged, thisUser.id, newPost?.id, "Tagged");
      }

    } else {
      const newPost = { 
        id: new Date().getTime(), 
        user: thisUser.username,
        userId: thisUser.id,
        postText: postText,
        likes: [],
        dislikes: [],
        commentArray: [],
        timeAdded: utcTimeAdded,
        forwardPost: forwardPost !== null ? forwardPost : "",
        taggedUser: tagged,
        trackId: trackId
      };

      const newPostArray = [...arrayPosts, newPost];
      queryClient.setQueryData('arrayPosts', newPostArray);
      await setDoc(doc(db, "posts", docId), { arrayPosts: newPostArray });
      console.log("Новый объект успешно добавлен в Firestore.");
      
      if (tagged) {
        addNotificationToUser(tagged, thisUser.id, newPost?.id, "Tagged");
      }
    }
  } catch (error) {
    console.error("Ошибка при добавлении нового объекта в Firestore:", error);
    console.log(arrayPosts);
  }
};




export   const deletePostFunction = async (idToDelete,arrayPosts,queryClient) => {
    try {
        
        const newArrayPosts = arrayPosts.filter(item => item.id !== idToDelete);

        queryClient.setQueryData('arrayPosts', newArrayPosts);
        await updateDoc(doc(db, "posts", docId), { arrayPosts: newArrayPosts });

        console.log("Элемент успешно удален из массива и из Firebase.");
        
    } catch (error) {
        console.error("Ошибка при удалении элемента:", error);
    }
};


export const pinPostFunction = async (postIdToPin,thisUser,arrayPosts, queryClient) => {
    try {
        
        const newArrayPosts = arrayPosts
        .map(post => 
            post.userId === thisUser.id && post.id === postIdToPin
                ? { ...post, pinned: post.id === postIdToPin } 
                : { ...post, pinned:false}
        );

        
        queryClient.setQueryData('arrayPosts', newArrayPosts);


        await updateDoc(doc(db, "posts", docId), { arrayPosts: newArrayPosts });

        console.log("Пост успешно закреплен.");
    } catch (error) {
        console.error("Ошибка при закреплении поста:", error);
    }
};




