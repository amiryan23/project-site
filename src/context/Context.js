import React, { createContext, useEffect, useContext, useState, useRef ,useMemo} from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc , getDocs , updateDoc  } from "firebase/firestore";
import { getStorage,ref, uploadBytes } from "firebase/storage";
import { getAuth , onAuthStateChanged } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import {auth,db,storage,docId,updatesDocId} from './../firebase'
import {useQuery,useQueryClient} from 'react-query'
import {usePostsQuery,useUsersQuery,useThisUserQuerry,useMusicsQuery,restorePostsFromCache} from './../hooks/queryesHooks';
import { useTranslation } from 'react-i18next';



const MyContext = createContext();


const MyContextProvider = ({ children }) => {

    const locationStorage = localStorage.getItem("location")
    const saveMeStorage = localStorage.getItem("saveMe")
   

  const [logined,setLogined] = useState(false)
  const [authUser,setAuthUser] = useState()
  // const [thisUser,setThisUser] = useState()
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth <= 900);
  const [openMenu,setOpenMenu] = useState(false)
  // const [arrayPosts,setArrayPosts] = useState(null)
  const [commentText,setCommentText] = useState({})
  // const [users, setUsers] = useState([]);
  const [theme,setTheme] = useState("light")
  const [notificText,setNotificText] = useState("")
  const [isStatusUpdated, setStatusUpdated] = useState(false);
  const [openUpdate,setOpenUpdate] = useState(true)
  const [fileUrls, setFileUrls] = useState({});
  const [openModal,setOpenModal] = useState(false)
  const [updatesData,setUpdatesData] = useState()
  const [srcMusicId,setSrcMusicId] = useState(null)
  const [openStoryModal,setOpenStoryModal] = useState(false)
  const [viewStory,setViewStory] = useState(false)

const [activeLink,setActiveLink] = useState(locationStorage ? locationStorage : "/home")

  const {t} = useTranslation()

 

const queryClient = useQueryClient();

  const { arrayPosts, postisLoading, postisError  } = usePostsQuery();
  const { users, usersisLoading, usersisError } = useUsersQuery();
  const {thisUser,thisUserisLoading,thisUserisError} = useThisUserQuerry()
  const { musicsArray, musicsisLoading, musicsisError } = useMusicsQuery();

  const file = useRef()


useEffect(()=>{
    if( thisUser){
        setLogined(true);
        localStorage.setItem('thisUserId', thisUser?.id)
    } else {
        setTimeout(()=>{localStorage.removeItem('thisUserId')},50) 
        setLogined(false);

    }
},[thisUser])





useEffect(() => {
  const isSubscribedStorage = localStorage.getItem('isSubscribed') === "true";
  const thisUserIdStorage = localStorage.getItem('thisUserId');

  const updateStatus = async (status) => {
    if (thisUser) {
      const userRef = doc(db, 'users', thisUser.id);
      await updateDoc(userRef, { onlineStatus: status });
      thisUser.onlineStatus = status;
      queryClient.setQueryData('thisUser', thisUser);
      localStorage.removeItem('isSubscribed');
    }
  };

  // const handleBeforeUnload = () => {
  //   updateStatus(false);
  //   localStorage.removeItem('location');
  // };

  const handlePageHide = (event) => {
    if (event.persisted ) {
      return;
    }
    updateStatus(false);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden' && isWideScreen) {
      updateStatus(false);
    } else if(document.visibilityState === 'visible' && isWideScreen){
      updateStatus(true)
    }
  };

  if (logined) {
    updateStatus(true);
  } else {
    updateStatus(false);
  }

  // window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('pagehide', handlePageHide);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    // window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('pagehide', handlePageHide);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [thisUser, isWideScreen , logined]);


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
        // return `${t("Month")} ${t("Ago")}`;
        return timeAdded
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


const zoomThisPhoto = (url) =>{
  localStorage.setItem("thisPhotoZoom",url)
  setOpenModal(true)
}





 const contextValue = useMemo(() => ({
        
        
        
        
        logined,
        setLogined,
       thisUser,
       users,
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
        setActiveLink,
        openUpdate,
        setOpenUpdate,
        fileUrls, 
        setFileUrls,
        openModal,
        setOpenModal,
        zoomThisPhoto,
        updatesData,
        srcMusicId,
        setSrcMusicId,
        openStoryModal,
        setOpenStoryModal,
        viewStory,
        setViewStory
    }), [logined, authUser, isWideScreen, openMenu, commentText,notificText,theme,t,activeLink,setActiveLink,openUpdate,fileUrls,updatesData,openModal,srcMusicId,setSrcMusicId,openStoryModal,viewStory]);

  return (
    <MyContext.Provider 
    value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };



