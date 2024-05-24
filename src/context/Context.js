import React, { createContext, useEffect, useContext, useState, useRef ,useMemo} from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc , getDocs , updateDoc  } from "firebase/firestore";
import { getStorage,ref, uploadBytes } from "firebase/storage";
import { getAuth , onAuthStateChanged } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import {auth,db,storage,docId} from './../firebase'
import {useQuery,useQueryClient} from 'react-query'
import {usePostsQuery,useUsersQuery,useThisUserQuerry} from './../hooks/queryesHooks';
import { useTranslation } from 'react-i18next';



const MyContext = createContext();

// Создаем провайдер контекста
const MyContextProvider = ({ children }) => {

    const locationStorage = localStorage.getItem("location")

  const [logined,setLogined] = useState(false)
  const [authUser,setAuthUser] = useState()
  // const [thisUser,setThisUser] = useState()
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth <= 900);
  const [openMenu,setOpenMenu] = useState(false)
  // const [arrayPosts,setArrayPosts] = useState(null)
  const [commentText,setCommentText] = useState(null)
  // const [users, setUsers] = useState([]);
  const [theme,setTheme] = useState("light")
  const [notificText,setNotificText] = useState("")
  const [isStatusUpdated, setStatusUpdated] = useState(false);

const [activeLink,setActiveLink] = useState(locationStorage ? locationStorage : "/home")

  const {t} = useTranslation()

const queryClient = useQueryClient();

  const { arrayPosts, postisLoading, postisError  } = usePostsQuery();
  const { users, usersisLoading, usersisError } = useUsersQuery();
  const {thisUser,thisUserisLoading,thisUserisError} = useThisUserQuerry()




useEffect(()=>{
    if(thisUser){
        setLogined(true);
    } else {
        setLogined(false);
    }
},[thisUser])



// useEffect(() => {
// 
//   localStorage.setItem('isSubscribed', true);
// 
//   const updateStatus = async (status) => {
//     const isSubscribed = localStorage.getItem('isSubscribed') === 'true';
//     if (isSubscribed && thisUser?.id) {
//       const userRef = doc(db, 'users', thisUser.id);
//       await updateDoc(userRef, { onlineStatus: status });
//       thisUser.onlineStatus = status;
//       queryClient.setQueryData('thisUser', thisUser);
//       localStorage.setItem('isSubscribed',false)
//     }
//   };
// 
//  
// 
//   const handleBeforeUnload = () => {
//     updateStatus(false);
//     localStorage.removeItem("location");
//     localStorage.removeItem('isSubscribed')
//   };
// 
//   if (thisUser) {
//    
//     updateStatus(true)
// 
//     window.addEventListener('beforeunload', handleBeforeUnload);
//   } else {
//     updateStatus(false)
//   }
// 
//  
// }, []);

  useEffect(() => {
    
    let isSubscribedStorage = localStorage.getItem('isSubscribed');

    const updateStatus = async (status) => {
      
      if (isSubscribedStorage === "true" && thisUser) {
        console.log(thisUser)
        const userRef = doc(db, 'users', thisUser.id);
        await updateDoc(userRef, { onlineStatus: status });
        thisUser.onlineStatus = status;
        queryClient.setQueryData('thisUser', thisUser);
        localStorage.removeItem('isSubscribed');
      }
    };

    const handleBeforeUnload = () => {
      // localStorage.setItem('isSubscribed', 'true')
      updateStatus(false);
      localStorage.removeItem('location');
      
    };

    if (thisUser) {
      updateStatus(true);
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

   
  }, [thisUser]); 


 useEffect(() => {
    function handleResize() {
      setIsWideScreen(window.innerWidth <= 1000);
    }

localStorage.setItem('isSubscribed', 'true')
    

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


const calculateTimeDifference = (timeAdded) => {

  const parts = timeAdded.split(/[,.: ]+/);
  

  const postTime = new Date(
    parts[2], // год
    parts[1] - 1, // месяц (от 0 до 11)
    parts[0], // день
    parts[3], // час
    parts[4], // минуты
    parts[5] // секунды
  );

  const currentTime = new Date();
  const differenceInMilliseconds = currentTime - postTime;
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
  
  const thresholdMinutes = 5;
  if (differenceInMinutes < 1) {
        // Менее минуты назад
        return t("Now");
    } else if (differenceInMinutes < 60) {
        // Менее часа назад
        return `${differenceInMinutes} ${t("Minutes")} ${t("Ago")}`;
    } else if (differenceInMinutes < 24 * 60) {
        // Менее суток назад
        const hours = Math.floor(differenceInMinutes / 60);
        return `${hours} ${t("Hour")}${hours > 1 ? t("s") : ""} ${t("Ago")}`;
    } else if (differenceInMinutes < 30 * 24 * 60) {
        // Менее месяца назад
        const days = Math.floor(differenceInMinutes / (24 * 60));
        return `${days} ${days > 1 ? t('Days') : t('Day')} ${t("Ago")}`;
    } else {
        // Более месяца назад
        return `${t("Month")} ${t("Ago")}`;
    }
};



 const copyToClipboard = (text) => {
    
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setNotificText(t('NotificLink'))
  
  };







 const contextValue = useMemo(() => ({
        
        
        
        
        logined,
        setLogined,
       thisUser,
        isWideScreen,
        openMenu,
        setOpenMenu,
        calculateTimeDifference,
        commentText,
        setCommentText,
        t,
        copyToClipboard,
        notificText,
        setNotificText,
        theme,
        setTheme,
        activeLink,
        setActiveLink
    }), [logined, authUser, isWideScreen, openMenu, commentText,notificText,theme,t,activeLink,setActiveLink]);

  return (
    <MyContext.Provider 
    value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };



