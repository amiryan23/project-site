// import { createSlice } from '@reduxjs/toolkit';
// 
// const initialState = {
//   isWideScreen: window.innerWidth <= 900,
//   openMenu: false,
//   notificText: "",
// };
// 
// const uiSlice = createSlice({
//   name: 'ui',
//   initialState,
//   reducers: {
//     setIsWideScreen: (state, action) => {
//       state.isWideScreen = action.payload;
//     },
//     setOpenMenu: (state, action) => {
//       state.openMenu = action.payload;
//     },
//     setNotificText: (state, action) => {
//       state.notificText = action.payload;
//     },
//   },
// });
// 
// export const { setIsWideScreen, setOpenMenu, setNotificText } = uiSlice.actions;
// 
// export default uiSlice;