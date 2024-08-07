import s from "./SettingsPage.module.scss"
import React,{ useState,useCallback,useEffect,useContext,useRef } from 'react'
import { MyContext } from './../../../context/Context';
import { doc, updateDoc } from "firebase/firestore";
import { getStorage,ref, uploadBytes } from "firebase/storage";
import { RiCheckboxBlankCircleLine ,RiCheckboxCircleFill} from "react-icons/ri";
import {firebaseConfig,db,storage,docId} from './../../../firebase'
import { useQueryClient,useQuery } from 'react-query';
import Resizer from 'react-image-file-resizer';
// import {useChangeInfoUser} from './../../../hooks/queryesHooks'
import { MdDeleteForever } from "react-icons/md";
import {Link} from 'react-router-dom'



const SettingsPage = () =>{

 const { thisUser,setNotificText,theme,setTheme,t,setActiveLink,logined} = useContext(MyContext);

 const [username,setUsername] = useState(thisUser?.username ? thisUser.username : "")
 const [age,setAge] = useState(thisUser?.age ? thisUser.age : "")
 const [country,setCountry] = useState(thisUser?.country ? thisUser.country : "")
 const [city,setCity] = useState(thisUser?.city ? thisUser.city : "")
 const [description,setDescription] = useState(thisUser?.description ? thisUser.description : "")
 const [link,setLink] = useState(thisUser?.link ? thisUser.link : "")
 const [error,setError] = useState("")
 const [accept,setAccept] = useState("")
 const [fileUrl, setFileUrl] = useState(null);
 const [privateProfile,setPrivateProfile] = useState(thisUser?.private ? thisUser.private : false)
 const [privateOnline,setPrivateOnline] = useState(thisUser?.disableOnlineStatus ? thisUser?.disableOnlineStatus : false)
 const [deleteThisPhoto,setDeleteThisPhoto] = useState(false)

const queryClient = useQueryClient();

// const { data: thisUser } = useQuery('thisUser', () => queryClient.getQueryData('thisUser'));


 const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));

 const imageRef = useRef()

 const animBlock = useRef()

 const userRef = useRef()

 // const changeInfoUserMutation = useChangeInfoUser()
 

 let timer;

 useEffect (()=>{
 	if(animBlock.current){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }

 setActiveLink("/")

 return () => {
 	if(animBlock.current){
 	animBlock.current.classList.remove(s.animBlock)
 	clearTimeout(timer)
 }
 }
 },[])

  const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setDeleteThisPhoto(false)
    
    }
  };


   const userNameVerify = users ?
   users?.filter(user => user.id !== thisUser?.id) 
   .some((user) => user.username?.toLowerCase() === username?.toLowerCase())
   : ""

    useEffect(()=>{
        
        if(userNameVerify && userRef.current){
            userRef.current.classList.add(s.userInvalid)
        } else if (!userNameVerify && userRef.current) {
            userRef.current.classList.remove(s.userInvalid)
        }
    },[username,userNameVerify])





const handlerChangeInfo = async () => {
	try {

 const userRef = doc(db, "users", thisUser?.id);

		if(fileUrl){
		const file = imageRef.current ? imageRef.current.files[0] : ""

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
            
            
            // Создаем ссылку на путь в Firebase Storage, куда будем загружать файл
            const storageRef = ref(storage, `imageUsers/${uniqueFilename}`);

            // Загружаем файл на Firebase Storage
            await uploadBytes(storageRef, compressedFile);

   const newData = {
   	username: username,
    age: age,
    country:country,
    city:city,
    link:link,
    photo:{
    	...thisUser.photo,
     placed:!deleteThisPhoto ? `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/imageUsers%2F${encodeURIComponent(uniqueFilename)}?alt=media` : "" 
  },
    description:description,
    private:privateProfile,
    disableOnlineStatus:privateOnline
  }
        
       const updatedThisUser = { ...thisUser, ...newData };

  queryClient.setQueryData("thisUser",updatedThisUser)
  await updateDoc(userRef,updatedThisUser);
  console.log("Данные пользователя успешно обновлены");
  setError("")
  setNotificText(t('NotificSettings'))
   setTimeout(()=>{window.history.back(-1)},50)

} else {

	const newData = {
    username: username,
    age: age,
    country: country,
    city: city,
    link:link,
		description: description,
    private:privateProfile,
    disableOnlineStatus:privateOnline

  }

       const updatedThisUser = { ...thisUser, ...newData };


  queryClient.setQueryData("thisUser",updatedThisUser)

	 await updateDoc(userRef,updatedThisUser );
	   console.log("Данные пользователя успешно обновлены");
  setError("")
  setNotificText(t('NotificSettings'))
  setTimeout(()=>{window.history.back(-1)},50)
  // setTimeout(()=>{window.location.href = "/home" },50)
}
} catch (error) {
  console.error("Ошибка при обновлении данных пользователя:", error);
  setError("Ошибка")
  
}
}



	return (
		logined
		? <div className={s.megaContainer} ref={animBlock}>
			<div className={s.content1}>
				{t('Settings')}
			</div>
			<div className={s.content2}>
				<span className={s.Block1}>
					<span className={s.item1}>
						<input ref={imageRef} id="userPhoto" type="file" style={{display:'none'}} onChange={handleFileChange}/>
						<label style={{backgroundImage: `url(${!deleteThisPhoto  ? fileUrl || thisUser?.photo?.placed : thisUser?.photo?.default})`}} htmlFor="userPhoto">{t('addPhoto')}</label>
					</span>
					<span className={s.item2}>
					<span>{t('ChangePhoto')}</span>
					<span onClick={()=>{
						setDeleteThisPhoto(true)
						console.log(deleteThisPhoto)
					}}><MdDeleteForever /></span>
					</span>
				</span>
				<span className={s.Block2}>
					<span className={s.item1}>
						<span>{t('Username')}</span>
						<span><input ref={userRef} value={username} pattern="^[a-zA-Z0-9]*$" minLength={4} maxLength={16} name="username" placeholder='Username' onChange={(e)=>{setUsername(e.target.value)}} type="text" /></span>
					</span>
					<span className={s.item1}>
						<span>{t('Age')}</span>
						<span><input value={age}  min="16" max="100" pattern="[1-9][0-9]?|100" name="age" placeholder='Age' onChange={(e)=>{setAge(e.target.value)}} type="text" /></span>
					</span>
					<span className={s.item1}>
						<span>{t('Country')}</span>
						<span><input value={country} onChange={(e)=>{setCountry(e.target.value)}} type="text" /></span>
					</span>
					<span className={s.item1}>
						<span>{t('City')}</span>
						<span><input value={city} onChange={(e)=>{setCity(e.target.value)}} type="text" /></span>
					</span>
					<span className={s.item1}>
						<span>{t('Link')}</span>
						<span><input value={link} maxLength={90} onChange={(e)=>{setLink(e.target.value)}} type="text" /></span>
					</span>

				</span>
			</div>
			<div className={s.content3}>
				<span className={s.item1}>{t('Description')}</span>
				<span className={s.item2}><input value={description} onChange={(e)=>{setDescription(e.target.value)}}  type="text" maxLength="35"/></span>
				
			</div>
			<div className={s.content4}>
				<span className={s.item3} onClick={()=>{setPrivateProfile((prevPrivateProfile)=> !prevPrivateProfile)}}>
			{t('MakePrfPrvt')} {privateProfile ? <RiCheckboxCircleFill color="limegreen"/>  : <RiCheckboxBlankCircleLine/>}</span>
				<span className={s.item4}>
					{/* <button onClick={()=>setTheme((prevTheme)=>prevTheme === "dark" ? "light" : "dark")}>Change theme</button> */}
				</span>
			</div>
			<div className={s.content4}>
				<span className={s.item3} onClick={()=>{setPrivateOnline((prevPrivateOnline)=> !prevPrivateOnline)}}>
			{t('DsbOnleStat')} {privateOnline ? <RiCheckboxCircleFill color="limegreen"/>  : <RiCheckboxBlankCircleLine/>}</span>
				<span className={s.item4}>
					{/* <button onClick={()=>setTheme((prevTheme)=>prevTheme === "dark" ? "light" : "dark")}>Change theme</button> */}
				</span>
			</div>
			<div className={s.content5}>
				<button onClick={handlerChangeInfo}>{t('SaveChanges')}</button>
				<p style={{color:"red"}}>{error}</p>
				
			</div>

		</div>
		: <div className="noLogined">You are not authorized <Link to="/" className="btnLogin">Login</Link></div>
		)
}

export default React.memo(SettingsPage)