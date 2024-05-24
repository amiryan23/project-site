// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getAuth , onAuthStateChanged } from "firebase/auth";
// 
// import { db, auth } from './../../firebase';
// 
// export const listenToAuthChanges = createAsyncThunk(
//   'auth/listenToAuthChanges',
//   async () => {
//     return new Promise((resolve, reject) => {
//       const unsubscribe = onAuthStateChanged(user => {
//         if (user) {
//           const uid = user.uid;
//           const userRef = db.collection('users').doc(uid);
//           userRef.get().then(docSnapshot => {
//             if (docSnapshot.exists()) {
//               resolve(user);
//             } else {
//               reject('Данные пользователя не найдены');
//             }
//           }).catch(error => {
//             reject('Ошибка при получении данных о пользователе из Firestore:', error);
//           });
//         } else {
//           resolve(null);
//         }
//       });
// 
//       // Returning a function to unsubscribe from the listener
//       return () => unsubscribe();
//     });
//   }
// );
// 
// const thisUserSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     thisUser: null,
//     loggedIn: false,
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: {
//     [listenToAuthChanges.pending]: state => {
//       state.status = 'loading';
//     },
//     [listenToAuthChanges.fulfilled]: (state, action) => {
//       state.status = 'succeeded';
//       state.user = action.payload;
//       state.loggedIn = !!action.payload;
//     },
//     [listenToAuthChanges.rejected]: (state, action) => {
//       state.status = 'failed';
//       state.error = action.error.message;
//     },
//   },
// });
// 
// export default thisUserSlice;