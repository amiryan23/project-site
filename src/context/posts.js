import {db,storage,docId,firebaseConfig} from './../firebase'
import { doc, updateDoc,setDoc  } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import imageCompression from 'browser-image-compression';



export  const addPostFunction = async (thisUser,postText,fileUrl,imageRef,forwardPost,arrayPosts,queryClient) => {
   	
    try {
     if (arrayPosts !== null && postText !== "") {

     	if(fileUrl){
     	 const file = imageRef.current.files[0];

         const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };

        // Сжимаем изображение
        const compressedFile = await imageCompression(file, options);

     	 	const timestamp = new Date().getTime();
  			const uniqueFilename = `post_${timestamp}_${compressedFile.name}`;
            
            // Создаем ссылку на путь в Firebase Storage, куда будем загружать файл
            const storageRef = ref(storage, `imagePosts/${uniqueFilename}`);

            // Загружаем файл на Firebase Storage
            await uploadBytes(storageRef, file);

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
          forwardPost: forwardPost !== null ? forwardPost : ""
          

        };
        const newPostArray = [...arrayPosts, newPost];
        queryClient.setQueryData('arrayPosts',newPostArray)
        await setDoc(doc(db, "posts", docId), { arrayPosts: newPostArray });
        console.log("Новый объект успешно добавлен в Firestore.");
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
          forwardPost: forwardPost !== null ? forwardPost : ""
          

        };
        const newPostArray = [...arrayPosts, newPost];
        queryClient.setQueryData('arrayPosts',newPostArray)
        await setDoc(doc(db, "posts", docId), { arrayPosts: newPostArray });
        console.log("Новый объект успешно добавлен в Firestore.");
    //     setNotificText("Новый пост успешно добавлено")
				// setPostText("")
    //     setFileUrl("")
       }
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