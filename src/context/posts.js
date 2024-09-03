import {db,storage,docId,firebaseConfig} from './../firebase'
import { doc, updateDoc,setDoc   } from "firebase/firestore";
import { ref, uploadBytes , getDownloadURL } from "firebase/storage";
import imageCompression from 'browser-image-compression';
import Resizer from 'react-image-file-resizer';
import {addNotificationToUser} from './../helper/addNotification'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'




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
        try {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();
    console.log("FFmpeg загружен успешно.");

    // Записываем файл в файловую систему FFmpeg
    await ffmpeg.writeFile('input.mov', await fetchFile(file));
    console.log("Файл записан в файловую систему FFmpeg.");

    // Сжимаем видео и конвертируем в MP4
    await ffmpeg.run(
      '-i', 'input.mov',
      '-vf', 'scale=1280:-1', // Изменение разрешения для сжатия
      '-b:v', '1000k', // Установка битрейта
      '-c:v', 'libx264',
      '-c:a', 'aac',
      'output.mp4'
    );
    console.log("Видео конвертировано.");

    // Чтение результата конвертации
    const data = await ffmpeg.readFile('output.mp4');
    console.log("Результат чтения файла:", data);

    // Преобразование результата в Blob
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    console.log("Преобразование результата в Blob завершено.");

    // Создание URL для видео
    const videoUrl = URL.createObjectURL(videoBlob);
    console.log("Созданный URL для видео:", videoUrl);

    // Загрузка видео на Firebase
    const storageRef = ref(storage, `videoPosts/${uniqueFilename}`);
    await uploadBytes(storageRef, videoBlob);
    videoURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/videoPosts%2F${encodeURIComponent(uniqueFilename)}?alt=media`;
    console.log("Видео загружено на Firebase. URL:", videoURL);

  } catch (error) {
    console.error("Ошибка при обработке видео:", error);
  }
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




