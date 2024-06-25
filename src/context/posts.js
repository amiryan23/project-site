import {db,storage,docId,firebaseConfig} from './../firebase'
import { doc, updateDoc,setDoc  } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import imageCompression from 'browser-image-compression';
import Resizer from 'react-image-file-resizer';
import {addNotificationToUser} from './../helper/addNotification'

export  const addPostFunction = async (thisUser,postText,fileUrl,imageRef,forwardPost,tagged,trackId,arrayPosts,queryClient) => {
   	
    try {
     

     	if(fileUrl){
     	 const file = imageRef.current.files[0];

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

     	 	const timestamp = new Date().getTime();
  			const uniqueFilename = `post_${timestamp}_${file.name}`;
            
            // Создаем ссылку на путь в Firebase Storage, куда будем загружать файл
            const storageRef = ref(storage, `imagePosts/${uniqueFilename}`);

            // Загружаем файл на Firebase Storage
            await uploadBytes(storageRef,compressedFile );

        const newPost = { 
          id: new Date().getTime(), 
          user:thisUser.username,
          userId:thisUser.id,
          postText:postText,
          likes:[],
          dislikes:[],
          commentArray:[],
          imageURL:fileUrl ? `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/imagePosts%2F${encodeURIComponent(uniqueFilename)}?alt=media` : false,
		  timeAdded: new Date().toLocaleString() ,
          forwardPost: forwardPost !== null ? forwardPost : "",
          taggedUser:tagged,
          trackId:trackId
          

        };
        const newPostArray = [...arrayPosts, newPost];
        queryClient.setQueryData('arrayPosts',newPostArray)
        await setDoc(doc(db, "posts", docId), { arrayPosts: newPostArray });
        console.log("Новый объект успешно добавлен в Firestore.");
        if(tagged){
            addNotificationToUser(tagged,thisUser.id,newPost?.id,"Tagged")
        }
        // setNotificText("Новый пост успешно добавлено")
        // setPostText("")
        // setFileUrl("")

       } else {
       	const newPost = { 
          id: new Date().getTime(), 
          user:thisUser.username,
          userId:thisUser.id,
          postText:postText,
          likes:[],
          dislikes:[],
          commentArray:[],
          timeAdded: new Date().toLocaleString() ,
          forwardPost: forwardPost !== null ? forwardPost : "",
          taggedUser:tagged,
          trackId:trackId
          

        };
        const newPostArray = [...arrayPosts, newPost];
        queryClient.setQueryData('arrayPosts',newPostArray)
        await setDoc(doc(db, "posts", docId), { arrayPosts: newPostArray });
        console.log("Новый объект успешно добавлен в Firestore.");
        if(tagged){
            addNotificationToUser(tagged,thisUser.id,newPost?.id,"Tagged")
        }
    //     setNotificText("Новый пост успешно добавлено")
				// setPostText("")
    //     setFileUrl("")
       }
      
    } catch (error) {
      console.error("Ошибка при добавлении нового объекта в Firestore:", error);
      console.log(arrayPosts)
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


export const AddStoryFunction = async (thisUser, fileUrl ,queryClient) => {
  try {
    

    if (!thisUser.storyArray) {
      thisUser.storyArray = [];
    }

    const storageRef = ref(storage, `StoryStorage/${fileUrl?.file?.name}`);

    
    await uploadBytes(storageRef, fileUrl?.file);

    const newStory = {
      id: new Date().getTime(),
      userId: thisUser.id,
      fileURL: fileUrl ? `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/StoryStorage%2F${encodeURIComponent(fileUrl?.file?.name)}?alt=media` : false,
      timeAdded: new Date().toLocaleString(), 
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