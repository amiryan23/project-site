import {useContext,useMemo} from 'react'
import { MyContext } from './Context';
import {  doc,  updateDoc  } from "firebase/firestore";
import { db } from './../firebase'








const useHandleFollow = () => {
  const { arrayPosts, thisUser, users , setNotificText } = useContext(MyContext);

 const handleFollow = async (thisUser, user) => {
  try {
    const userRef = doc(db, 'users', user.id);
    const followedUserRef = doc(db, 'users', thisUser.id);

    let arrayRequest = user.userData?.requests || [];
    let arrayFollowers = user.userData?.followers || [];
    let arrayFollowing = thisUser.userData?.following || [];

    let isFollowing = arrayFollowing.includes(user.id);
    let isRequest = arrayRequest.includes(thisUser.id);

    if (user.private && !isFollowing) {
      if (!isRequest ) {
        arrayRequest.push(thisUser.id);

        await updateDoc(userRef, {
          userData: {
            followers: user.userData?.followers || [],
            following: user.userData?.following || [],
            requests: arrayRequest
          }
        });

        console.log("Запрос на подписку отправлен");
        setNotificText("Запрос на подписку отправлен");
      } else {
        arrayRequest = arrayRequest.filter(id => id !== thisUser.id);

        await updateDoc(userRef, {
          userData: {
            followers: user.userData?.followers || [],
            following: user.userData?.following || [],
            requests: arrayRequest
          }
        });

        console.log("Запрос на подписку отменен");
        setNotificText("Запрос на подписку отменен");
      }
    } else {
      if (isFollowing) { // Проверяем, подписан ли уже пользователь
        arrayFollowers = arrayFollowers.filter(id => id !== thisUser.id);
        arrayFollowing = arrayFollowing.filter(id => id !== user.id);

        await Promise.all([
          updateDoc(userRef, {
            userData: {
              followers: arrayFollowers,
              following: user.userData?.following || [],
              requests: user.userData?.requests || []
            }
          }),
          updateDoc(followedUserRef, {
            userData: {
              followers: thisUser.userData?.followers || [],
              following: arrayFollowing,
              requests: thisUser.userData?.requests || []
            }
          })
        ]);

        console.log("Пользователь успешно удален из списка подписок");
        setNotificText("Пользователь успешно удален из списка подписок");
      } else {
        arrayFollowers.push(thisUser.id);
        arrayFollowing.push(user.id);

        await Promise.all([
          updateDoc(userRef, {
            userData: {
              followers: arrayFollowers,
              following: user.userData?.following || [],
              requests: user.userData?.requests || []
            }
          }),
          updateDoc(followedUserRef, {
            userData: {
              followers: thisUser.userData?.followers || [],
              following: arrayFollowing,
              requests: thisUser.userData?.requests || []
            }
          })
        ]);

        console.log("Пользователь успешно добавлен в список подписок");
        setNotificText("Пользователь успешно добавлен в список подписок");
      }
    }
  } catch (error) {
    console.error("Ошибка при обработке подписки:", error);
  }
};


  return handleFollow;
};

const useAcceptRequest = () => {
  const { arrayPosts, thisUser, users , setNotificText } = useContext(MyContext);

 const acceptRequest = async (thisUser, user) => {
  try{
    
    const userRef = doc(db, 'users', user.id);
    const thisUserRef = doc(db, 'users', thisUser.id);

    let arrayRequestThis = thisUser.userData?.requests || []
    let arrayFollowersThis = thisUser.userData?.followers || []
    let arrayFollowingThis = thisUser.userData?.following || []

    let arrayRequest = user.userData?.requests || []
    let arrayFollowers= user.userData?.followers || []
    let arrayFollowing= user.userData?.following || []

    arrayFollowersThis.push(user.id)

    arrayRequestThis = arrayRequest.filter(id => id !== user.id)

    await updateDoc(thisUserRef, {
        userData: {
          followers: arrayFollowersThis,
            following: thisUser.userData?.following || [] ,
            requests: arrayRequestThis
        }
    })

    arrayFollowing.push(thisUser.id)

     await updateDoc(userRef, {
        userData: {
          followers: arrayFollowers, 
            following: arrayFollowing ,
            requests: arrayRequest
        }
    })

     setNotificText("Запрос на подписку принят");

  } catch(error) {
    console.error("Ошибка при обработке подписки:", error);

  }
}

  return acceptRequest;
};

const useCancelRequest = () => {
  const { arrayPosts, thisUser, users , setNotificText } = useContext(MyContext);

const cancelRequest = async (thisUser,user) => {
  try{
     const thisUserRef = doc(db, 'users', thisUser.id);

     let arrayRequest = thisUser.userData?.requests || []
    let arrayFollowers = thisUser.userData?.followers || []
    let arrayFollowing = thisUser.userData?.following || []

      arrayRequest = arrayRequest.filter(id => id !== user.id)

    await updateDoc(thisUserRef, {
        userData: {
          followers: arrayFollowers,
            following: arrayFollowing ,
            requests: arrayRequest
        }
    })

setNotificText("Запрос на подписку откланенно");
  } catch (error) {
    console.error("Ошибка при обработке подписки:", error);
  }
}

  return cancelRequest;
};

export { useHandleFollow, useAcceptRequest, useCancelRequest };