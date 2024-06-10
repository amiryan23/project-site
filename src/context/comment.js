import {db,docId,firebaseConfig,storage} from './../firebase'
import { doc, updateDoc ,arrayUnion  } from "firebase/firestore";
import Resizer from 'react-image-file-resizer';
import { getStorage,ref, uploadBytes } from "firebase/storage";
import {addNotificationToUser} from './../helper/addNotification'




export const likePostFunction = async (postId, userId, arrayPosts, queryClient) => {
    try {
        const postIndex = arrayPosts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
            const post = arrayPosts[postIndex];
            const updatedPosts = [...arrayPosts];

            const isDisliked = post.dislikes.includes(userId);
            if (isDisliked) {
                const updatedDislikes = post.dislikes.filter(id => id !== userId);
                updatedPosts[postIndex].dislikes = updatedDislikes;
            }

            const isLiked = post.likes.includes(userId);
            if (isLiked) {
                const updatedLikes = post.likes.filter(id => id !== userId);
                updatedPosts[postIndex].likes = updatedLikes;
            } else {
                updatedPosts[postIndex].likes.push(userId);
                addNotificationToUser(post.userId,userId,post.id,"Like");
                
            }

            queryClient.setQueryData('arrayPosts', updatedPosts);
            const postDocRef = doc(db, "posts", docId);
            await updateDoc(postDocRef, { arrayPosts: updatedPosts });

            console.log("Лайк успешно добавлен/удален к посту.");
        } else {
            console.log("Пост не найден.");
        }
    } catch (error) {
        console.error("Ошибка при обновлении лайка к посту:", error);
    }
};



export const dislikePostFunction = async (postId, userId , arrayPosts , queryClient) => {
    try {
       
        const postIndex = arrayPosts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
           
            const post = arrayPosts[postIndex];
            
            const isLiked = post.likes.includes(userId);
           
            const updatedPosts = [...arrayPosts];
           
            if (isLiked) {
                const updatedLikes = post.likes.filter(id => id !== userId);
                updatedPosts[postIndex].likes = updatedLikes;
            }
            
            const isDisliked = post.dislikes.includes(userId);
          
            if (isDisliked) {
                const updatedDislikes = post.dislikes.filter(id => id !== userId);
                updatedPosts[postIndex].dislikes = updatedDislikes;
            } else {
             
                updatedPosts[postIndex].dislikes.push(userId);
            }
         
           
            queryClient.setQueryData('arrayPosts', updatedPosts);
            const postDocRef = doc(db, "posts", docId);
            await updateDoc(postDocRef, { arrayPosts: updatedPosts });
            console.log("Дизлайк успешно добавлен/удален к посту.");
            
        } else {
            console.log("Пост не найден.");
        }
    } catch (error) {
        console.error("Ошибка при обновлении дизлайка к посту:", error);
    }
};

export const savePostToFavorite = async (postId,userId,arrayPosts,queryClient) => {
    try {
        const postIndex = arrayPosts.findIndex(post => post.id === postId)

        if(postIndex !== -1) {
            const post = arrayPosts[postIndex];

            if (!post.savingThisPost) {
                post.savingThisPost = [];
            }

            const save = post.savingThisPost?.includes(userId);

            const updatedPosts = [...arrayPosts];

            if(save){
                const updatedSave = post.savingThisPost.filter(id => id !== userId);
                updatedPosts[postIndex].savingThisPost = updatedSave
            } else {
                updatedPosts[postIndex].savingThisPost.push(userId)
            }

            queryClient.setQueryData('arrayPosts' , updatedPosts);
            const postDocRef = doc(db,"posts",docId);
            await updateDoc(postDocRef, {arrayPosts:updatedPosts });
            console.log("Добовлена в избранное")
        } else{
            console.log("Пост не найден")
        }

    } catch (error){
        console.error("Ошибка при сохранени поста")
    }
}


export const addCommentPostFunction = async (postId, userId, thisUser , commentText  , replyComment , file ,arrayPosts, queryClient) => {
    try {

        
        if(arrayPosts){
        const postIndex = arrayPosts.findIndex(post => post.id === postId);

        if (postIndex !== -1) {

               


            if(file){ 
                  const compressedFile = await new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            file.width, 
            file.height, 
            'JPEG', 
            80, 
            0, 
            (uri) => {
              resolve(uri);
            },
            'file'
          );
        });

        const timestamp = new Date().getTime();
            const uniqueFilename = `post_${timestamp}_${file.name}`;
            
            
            
            const storageRef = ref(storage, `imageComments/${uniqueFilename}`);

            
            await uploadBytes(storageRef, compressedFile);

        
            const post = arrayPosts[postIndex];
           
            const updatedPosts = [...arrayPosts];

            const thisRepleyPost = replyComment ? replyComment[postId] : ""
          
       

            const comment = 
            { 
            id:new Date().getTime(),
            userId: userId, 
            userName:thisUser.username,
            commentText: commentText ,
            imgUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/imageComments%2F${encodeURIComponent(uniqueFilename)}?alt=media`  ,
            timeAdded: new Date().toLocaleString() ,
            replyComment:thisRepleyPost
            };




        
            updatedPosts[postIndex].commentArray.push(comment);
  
            // setCommentText("")

            
            queryClient.setQueryData('arrayPosts', updatedPosts);
            const postDocRef = doc(db, "posts", docId);
            await updateDoc(postDocRef, { arrayPosts: updatedPosts });

            addNotificationToUser(post.userId,thisUser.id,post.id,"Comment");
            console.log("Комментарий успешно добавлен к посту.");
            // setNotificText("Комментарий успешно добавлен к посту")

                } else if(commentText !== "" && commentText !== undefined && !file) {

            const updatedPosts = [...arrayPosts];

            const thisRepleyPost = replyComment ? replyComment[postId] : ""

            const comment = 
            { 
            id:new Date().getTime(),
            userId: userId, 
            userName:thisUser.username,
            commentText: commentText ,
            imgUrl:"",
            timeAdded: new Date().toLocaleString() ,
            replyComment:thisRepleyPost
            };



            const post = arrayPosts[postIndex];
        
            updatedPosts[postIndex].commentArray.push(comment);
  
            queryClient.setQueryData('arrayPosts', updatedPosts);
            const postDocRef = doc(db, "posts", docId);
            await updateDoc(postDocRef, { arrayPosts: updatedPosts });
             addNotificationToUser(post.userId,thisUser.id,post.id,"Comment");
            console.log("Комментарий успешно добавлен к посту.");
                }
        } else {
            console.log("Пост не найден.");
        }
      }
    } catch (error) {
        console.error("Ошибка при добавлении комментария к посту:", error);
    }
};





export const deleteCommentPostFunction = async (postId,arrayPosts,commentIdToDelete,queryClient) => {
    try{

        const postIndex = arrayPosts.findIndex(post => post.id === postId);

        

        const filterCommentArray = arrayPosts[postIndex].commentArray.filter(comment=> comment.id !== commentIdToDelete )

            const updatedPosts = [...arrayPosts];
    updatedPosts[postIndex] = {
      ...updatedPosts[postIndex],
      commentArray: filterCommentArray
    };

        queryClient.setQueryData('arrayPosts',updatedPosts);
        await updateDoc(doc(db, "posts", docId), { arrayPosts: updatedPosts });

    } catch (error) {
        console.error("Ошибка при удалении Комментарий:", error)
    }
}





