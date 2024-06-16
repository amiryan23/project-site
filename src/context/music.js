import {db,storage,docId,firebaseConfig} from './../firebase'
import { doc, updateDoc,setDoc  } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import imageCompression from 'browser-image-compression';
import Resizer from 'react-image-file-resizer';


export  const addMusicFunction = async (thisUser,trackName,imageRef,trackRef,musicsArray,queryClient) => {
   	
    try {
     

          	
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
  			const uniqueFilename = `musicPhoto_${timestamp}_${file.name}`;
            
   
            const storageRef = ref(storage, `Musics/${uniqueFilename}`);

            await uploadBytes(storageRef,compressedFile );


            const trackFile = trackRef.current.files[0]
            const timestampTrack = new Date().getTime();

           const uniqueFilenameTrack = `music_${timestampTrack}_${trackFile.name}`;

            const storageRefTrack = ref(storage, `Musics/${uniqueFilenameTrack}`);

            await uploadBytes(storageRefTrack,trackFile );

       	const newMusic = { 
          id: new Date().getTime(), 
          addedUser:thisUser.id,
          trackName:trackName,
          trackImgUrl:`https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/Musics%2F${encodeURIComponent(uniqueFilename)}?alt=media`,
          urlTrack:`https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/Musics%2F${encodeURIComponent(uniqueFilenameTrack)}?alt=media`,
          

        };
        const newMusicArray = [...musicsArray, newMusic];
        queryClient.setQueryData('musicsArray',newMusicArray)
        await setDoc(doc(db, "musics", "R9eO71o2f8f90NUDZOk9"), { musicsArray: newMusicArray });
        console.log("Новый объект успешно добавлен в Firestore.");
        window.history.back(-1)
       
      
    } catch (error) {
      console.error("Ошибка при добавлении нового объекта в Firestore:", error);
      console.log(musicsArray)
    }
  };
