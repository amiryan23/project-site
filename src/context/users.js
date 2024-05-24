import {db,docId,storage,firebaseConfig} from './../firebase'
import { doc, updateDoc  } from "firebase/firestore";
import { getStorage,ref, uploadBytes } from "firebase/storage";



export const followFunction = async (thisUser, user, queryClient) => {
  try {
    // Получаем ссылки на документы пользователя и текущего пользователя
    const userDocRef = doc(db, 'users', user.id);
    const thisUserDocRef = doc(db, 'users', thisUser.id);

    // Получаем текущие данные из кэша queryClient
    const usersArray = queryClient.getQueryData('users');
    const thisUserSnapshot = queryClient.getQueryData('thisUser');

    if (!usersArray || !thisUserSnapshot) {
      throw new Error('User data not found in cache.');
    }

    // Находим пользователя в массиве пользователей
    const userIndex = usersArray.findIndex(u => u.id === user.id);
    if (userIndex === -1) {
      throw new Error('User not found in cache.');
    }

    let arrayRequest = usersArray[userIndex].userData?.requests || [];
    let arrayFollowers = usersArray[userIndex].userData?.followers || [];
    let arrayFollowing = thisUserSnapshot.userData?.following || [];

    let isFollowing = arrayFollowing.includes(user.id);
    let isRequest = arrayRequest.includes(thisUser.id);

    if (user.private && !isFollowing) {
      if (!isRequest) {
        arrayRequest.push(thisUser.id);

        usersArray[userIndex].userData.requests = arrayRequest;
        queryClient.setQueryData('users', usersArray);
        await updateDoc(userDocRef, { 'userData.requests': arrayRequest });

        console.log("Запрос на подписку отправлен");
      } else {
        arrayRequest = arrayRequest.filter(id => id !== thisUser.id);

        usersArray[userIndex].userData.requests = arrayRequest;
        queryClient.setQueryData('users', usersArray);
        await updateDoc(userDocRef, { 'userData.requests': arrayRequest });

        console.log("Запрос на подписку отменен");
      }
    } else {
       if(!isFollowing) {
        arrayFollowers.push(thisUser.id);
        arrayFollowing.push(user.id);

        usersArray[userIndex].userData.followers = arrayFollowers;
        thisUserSnapshot.userData.following = arrayFollowing;

        queryClient.setQueryData('users', usersArray);
        queryClient.setQueryData('thisUser', thisUserSnapshot);

        await Promise.all([
          updateDoc(userDocRef, { 'userData.followers': arrayFollowers }),
          updateDoc(thisUserDocRef, { 'userData.following': arrayFollowing })
        ]);

        console.log("Пользователь успешно добавлен в список подписок");
      }
    }
  } catch (error) {
    console.error("Ошибка при обработке подписки:", error);
  }
};


export const unfollowFunction = async (thisUser, user, usersArray, queryClient) => {
    try{
        
         const userDocRef = doc(db, 'users', user.id);
    const thisUserDocRef = doc(db, 'users', thisUser.id);

    // Получаем текущие данные из кэша queryClient
    // const usersArray = queryClient.getQueryData('users');
    // const thisUserSnapshot = queryClient.getQueryData('thisUser');

    if (!usersArray || !thisUser) {
      throw new Error('User data not found in cache.');
    }

    const userIndex = usersArray.findIndex(u => u.id === user.id);
    if (userIndex === -1) {
      throw new Error('User not found in cache.');
    }

      let arrayRequest = usersArray[userIndex].userData?.requests || [];
    let arrayFollowers = usersArray[userIndex].userData?.followers || [];
    let arrayFollowing = thisUser.userData?.following || [];

    let isFollowing = arrayFollowing.includes(user.id);
    let isRequest = arrayRequest.includes(thisUser.id);

    if (isFollowing) { 
        arrayFollowers = arrayFollowers.filter(id => id !== thisUser.id);
        arrayFollowing = arrayFollowing.filter(id => id !== user.id);

        usersArray[userIndex].userData.followers = arrayFollowers;
        thisUser.userData.following = arrayFollowing;

        queryClient.setQueryData('users', usersArray);
        queryClient.setQueryData('thisUser', thisUser);

        await Promise.all([
          updateDoc(userDocRef, { 'userData.followers': arrayFollowers }),
          updateDoc(thisUserDocRef, { 'userData.following': arrayFollowing })
        ]);

        console.log("Пользователь успешно удален из списка подписок");
      }

    }catch (error){
        console.error("Ошибка при обработке отписки:",error)
    }
}


export const accpetRequestFunction = async (thisUser, user, usersArray, queryClient ) =>{
    try{
    const userRef = doc(db, 'users', user.id);
    const thisUserRef = doc(db, 'users', thisUser.id);

    const userIndex = usersArray.findIndex(u => u.id === user.id);

    if (userIndex === -1) {
      throw new Error('User not found in cache.');
    }

    let arrayRequestThis = thisUser.userData?.requests || []
    let arrayFollowersThis = thisUser.userData?.followers || []
    let arrayFollowingThis = thisUser.userData?.following || []

    let arrayRequest = usersArray[userIndex].userData?.requests || []
    let arrayFollowers= usersArray[userIndex].userData?.followers || []
    let arrayFollowing= usersArray[userIndex].userData?.following || []

    arrayFollowersThis.push(user.id)



    // arrayRequestThis = arrayRequest.filter(id => id !== user.id)

        thisUser.userData.requests = arrayRequestThis.filter(id => id !== user.id)

        thisUser.userData.followers = arrayFollowersThis;

        queryClient.setQueryData('thisUser', thisUser);

    await updateDoc(thisUserRef,  thisUser )

    

        usersArray[userIndex].userData.following = arrayFollowing.push(thisUser.id);

        queryClient.setQueryData('users', usersArray);

     await updateDoc(userRef, {'userData.following': arrayFollowing})

     

    }catch (error) {
        console.log("Ошибка",error)
    }
}


export const cancelRequestFunction = async (thisUser,user,queryClient) => {
  try{
     const thisUserRef = doc(db, 'users', thisUser.id);

     let arrayRequest = thisUser.userData?.requests || []
   
    thisUser.userData.requests = arrayRequest.filter(id => id !== user.id)

      queryClient.setQueryData('thisUser', thisUser);

    await updateDoc(thisUserRef, thisUser)


  } catch (error) {
    console.error("Ошибка при обработке подписки:", error);
  }
}




