import {db,docId} from './../firebase'
import { doc, updateDoc  } from "firebase/firestore";




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



export const addCommentPostFunction = async (postId, userId, thisUser , commentText , arrayPosts , queryClient) => {
    try {
        if(commentText !== ""){
        const postIndex = arrayPosts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
        
            const post = arrayPosts[postIndex];
           
            const updatedPosts = [...arrayPosts];
          
            const comment = 
            { 
            id:new Date().getTime(),
            userId: userId, 
            userName:thisUser.username,
            commentText: commentText ,
            imgUrl:"",
            timeAdded: new Date().toLocaleString() ,
            };
            updatedPosts[postIndex].commentArray.push(comment);
  
            // setCommentText("")
            
            queryClient.setQueryData('arrayPosts', updatedPosts);
            const postDocRef = doc(db, "posts", docId);
            await updateDoc(postDocRef, { arrayPosts: updatedPosts });

            console.log("Комментарий успешно добавлен к посту.");
            // setNotificText("Комментарий успешно добавлен к посту")


        } else {
            console.log("Пост не найден.");
        }
      }
    } catch (error) {
        console.error("Ошибка при добавлении комментария к посту:", error);
    }
};






