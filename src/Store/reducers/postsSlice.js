// import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
// import { getDoc, doc , updateDoc} from 'firebase/firestore'; // Импортируем необходимые функции из Firebase
// import { db , docId } from './../../firebase'; // Импортируем экземпляр Firestore из нашего файла конфигурации Firebase
// 
// export const fetchPosts = createAsyncThunk(
//   'posts/fetchPosts',
//   async () => {
//     try {
//       const docRef = db.collection('posts');
//       const snapshot = await docRef.get();
//       const arrayPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       return arrayPosts;
//     } catch (error) {
//       throw Error('Ошибка при получении данных из Firebase:', error);
//     }
//   }
// );
// 
// export const likePost = createAsyncThunk(
//   'posts/likePost',
//   async ({ postId, userId }, { getState }) => {
//     try {
//       const { arrayPosts } = getState().posts;
//       const postIndex = arrayPosts.findIndex(post => post.id === postId);
//       if (postIndex !== -1) {
//         const post = arrayPosts[postIndex];
//         const updatedPosts = [...arrayPosts];
//         const isDisliked = post.dislikes.includes(userId);
//         if (isDisliked) {
//           const updatedDislikes = post.dislikes.filter(id => id !== userId);
//           updatedPosts[postIndex].dislikes = updatedDislikes;
//         }
//         const isLiked = post.likes.includes(userId);
//         if (!isLiked) {
//           updatedPosts[postIndex].likes.push(userId);
//         }
//         await updatePostData(updatedPosts);
//         return updatedPosts;
//       } else {
//         throw new Error("Пост не найден.");
//       }
//     } catch (error) {
//       throw new Error('Ошибка при обновлении лайка к посту: ' + error);
//     }
//   }
// );
// 
// export const dislikePost = createAsyncThunk(
//   'posts/dislikePost',
//   async ({ postId, userId }, { getState }) => {
//     try {
//       const { arrayPosts } = getState().posts;
//       const postIndex = arrayPosts.findIndex(post => post.id === postId);
//       if (postIndex !== -1) {
//         const post = arrayPosts[postIndex];
//         const updatedPosts = [...arrayPosts];
//         const isLiked = post.likes.includes(userId);
//         if (isLiked) {
//           const updatedLikes = post.likes.filter(id => id !== userId);
//           updatedPosts[postIndex].likes = updatedLikes;
//         }
//         const isDisliked = post.dislikes.includes(userId);
//         if (!isDisliked) {
//           updatedPosts[postIndex].dislikes.push(userId);
//         }
//         await updatePostData(updatedPosts);
//         return updatedPosts;
//       } else {
//         throw new Error("Пост не найден.");
//       }
//     } catch (error) {
//       throw new Error('Ошибка при обновлении дизлайка к посту: ' + error);
//     }
//   }
// );
// 
// export const addCommentToPost = createAsyncThunk(
//   'posts/addCommentToPost',
//   async ({ postId, userId, commentText, userName }, { getState }) => {
//     try {
//       const { arrayPosts } = getState().posts;
//       if (commentText !== "") {
//         const postIndex = arrayPosts.findIndex(post => post.id === postId);
//         if (postIndex !== -1) {
//           const updatedPosts = [...arrayPosts];
//           const comment = {
//             id: new Date().getTime(),
//             userId: userId,
//             userName: userName,
//             commentText: commentText,
//             imgUrl: "",
//             timeAdded: new Date().toLocaleString(),
//           };
//           updatedPosts[postIndex].commentArray.push(comment);
//           await updatePostData(updatedPosts);
//           return updatedPosts;
//         } else {
//           throw new Error("Пост не найден.");
//         }
//       }
//     } catch (error) {
//       throw new Error('Ошибка при добавлении комментария к посту: ' + error);
//     }
//   }
// );
// 
// export const deletePost = createAsyncThunk(
//   'posts/deletePost',
//   async (postId, { getState }) => {
//     try {
//       const { arrayPosts } = getState().posts;
//       const newArrayPosts = arrayPosts.filter(item => item.id !== postId);
//       await updatePostData(newArrayPosts);
//       return newArrayPosts;
//     } catch (error) {
//       throw new Error('Ошибка при удалении поста: ' + error);
//     }
//   }
// );
// 
// export const copyPostLink = createAsyncThunk(
//   'posts/copyPostLink',
//   async (text) => {
//     try {
//       const textarea = document.createElement('textarea');
//       textarea.value = text;
//       document.body.appendChild(textarea);
//       textarea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textarea);
//       return "Ссылка успешно скопирована";
//     } catch (error) {
//       throw new Error('Ошибка при копировании ссылки на пост: ' + error);
//     }
//   }
// );
// 
// const updatePostData = async (updatedPosts) => {
//   try {
//     await updateDoc(doc(db, "posts", docId), { arrayPosts: updatedPosts });
//   } catch (error) {
//     throw new Error('Ошибка при обновлении данных поста в Firestore: ' + error);
//   }
// };
// 
// const postSlice = createSlice({
//   name: 'posts',
//   initialState: {
//     arrayPosts: [],
//     status: 'idle',
//     error: null,
//     commentText: ""
//   },
//   reducers: {},
//   extraReducers: {
//     [fetchPosts.pending]: (state) => {
//       state.status = 'loading';
//     },
//     [fetchPosts.fulfilled]: (state, action) => {
//       state.status = 'succeeded';
//       state.posts = action.payload;
//     },
//     [fetchPosts.rejected]: (state, action) => {
//       state.status = 'failed';
//       state.error = action.error.message;
//     },
//      [likePost.fulfilled]: (state, action) => {
//       state.status = 'succeeded';
//       state.arrayPosts = action.payload;
//     },
//     [dislikePost.fulfilled]: (state, action) => {
//       state.status = 'succeeded';
//       state.arrayPosts = action.payload;
//     },
//     [addCommentToPost.fulfilled]: (state, action) => {
//       state.status = 'succeeded';
//       state.arrayPosts = action.payload;
//     },
//     [deletePost.fulfilled]: (state, action) => {
//       state.status = 'succeeded';
//       state.arrayPosts = action.payload;
//     },
//     [copyPostLink.fulfilled]: (state, action) => {
//       state.status = 'succeeded';
//       state.notificText = action.payload;
//     },
//     [likePost.rejected]: (state, action) => {
//       state.status = 'failed';
//       state.error = action.error.message;
//     },
//     [dislikePost.rejected]: (state, action) => {
//       state.status = 'failed';
//       state.error = action.error.message;
//     },
//     [addCommentToPost.rejected]: (state, action) => {
//       state.status = 'failed';
//       state.error = action.error.message;
//     },
//     [deletePost.rejected]: (state, action) => {
//       state.status = 'failed';
//       state.error = action.error.message;
//     },
//     [copyPostLink.rejected]: (state, action) => {
//       state.status = 'failed';
//       state.error = action.error.message;
//     },
//   },
// });
// 
// export default postSlice;