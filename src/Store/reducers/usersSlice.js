// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { db } from './../../firebase';
// 
// export const fetchUsers = createAsyncThunk(
//   'users/fetchUsers',
//   async () => {
//     try {
//       const usersCollection = db.collection('users');
//       const snapshot = await usersCollection.get();
//       const usersArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       return usersArray;
//     } catch (error) {
//       throw new Error('Ошибка при получении пользователей из Firestore:' + error);
//     }
//   }
// );
// 
// const usersSlice = createSlice({
//   name: 'users',
//   initialState: {
//     users: [],
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: {
//     [fetchUsers.pending]: state => {
//       state.status = 'loading';
//     },
//     [fetchUsers.fulfilled]: (state, action) => {
//       state.status = 'succeeded';
//       state.users = action.payload;
//     },
//     [fetchUsers.rejected]: (state, action) => {
//       state.status = 'failed';
//       state.error = action.error.message;
//     },
//   },
// });
// 
// export default usersSlice;