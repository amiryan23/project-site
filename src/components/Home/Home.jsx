import s from './Home.module.scss'
import {NavLink,Link} from "react-router-dom"
import { HiHome } from "react-icons/hi";
import { FaUser,FaUsers,FaMusic } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import React,{ useState,Suspense,useContext,useRef,useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from './../Loading/Loading'
import { TbMessageCircle2Filled } from "react-icons/tb";
import { MyContext } from './../../context/Context';
import { FaChevronCircleLeft } from "react-icons/fa";
import { IoIosReturnLeft } from "react-icons/io";
import { IoExit } from "react-icons/io5";
import {signOut} from 'firebase/auth'
import {auth,db,storage,docId} from './../../firebase'
import Language from './../Language/Language'
import { useQueryClient,useQuery } from 'react-query';
import {updatesArray} from './../../helper/updatesArray'

const HomePage = React.lazy(()=>import('./HomePage/HomePage'))
const ProfilePage = React.lazy(()=>import('./ProfilePage/ProfilePage'))
const UsersPage = React.lazy(()=>import('./UsersPage/UsersPage'))
const MusicPage = React.lazy(()=>import('./MusicPage/MusicPage'))
const SettingsPage = React.lazy(()=>import('./SettingsPage/SettingsPage'))
const CommentPage = React.lazy(()=>import('./CommentPage/CommentPage'))
const OtherPage = React.lazy(()=>import('./OtherPage/OtherPage'))
const EditPost = React.lazy(()=> import('./ProfilePage/EditPost/EditPost'))
const OtherFollowers = React.lazy(()=> import('./OtherPage/OtherFollowers/OtherFollowers'))
const OtherFollowing = React.lazy(()=> import('./OtherPage/OtherFollowing/OtherFollowing'))
const MyFollowers = React.lazy(()=> import('./ProfilePage/MyFollowers/MyFollowers'))
const MyFollowing = React.lazy(()=> import('./ProfilePage/MyFollowing/MyFollowing'))
const UpdatedSitePage = React.lazy(()=>import('./../UpdatedSitePage/UpdatedSitePage'))
const SavePage = React.lazy(()=>import('./SavePage/SavePage'))
const NotificationPage = React.lazy(()=>import('./NotificationPage/NotificationPage'))




const Home = ()=> {

//     const locationStorage = localStorage.getItem("location")
// 
// 
//     const [activeLink,setActiveLink] = useState(locationStorage ? locationStorage : "/home")
    const [open,setOpen] = useState(false)

     const {  logined, setLogined  , thisUser , isWideScreen,openMenu,setOpenMenu,activeLink,setActiveLink,openUpdate,setOpenUpdate,t} = useContext(MyContext);

     const mobileMenuAnim = useRef()

     const queryClient = useQueryClient();

        const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    // const { data: thisUser } = useQuery('thisUser', () => queryClient.getQueryData('thisUser'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));

   

    const changeActvieLink = (path) =>{
        setActiveLink(path)
    }

    const signOutHandler = () =>{
        setLogined(false)
       setTimeout(()=>{ signOut(auth)
        .then(()=> window.location.href = "/")

        localStorage.removeItem("saveMe")
        },250)
    }



    const usersWithPostCount = users?.map(user => ({
  ...user,
  postCount: arrayPosts?.filter(post => post.userId === user.id).length || 0,
}));

const sortedUsers = usersWithPostCount?.sort((a, b) => b.postCount - a.postCount).slice(0,5);

const topUsersList = sortedUsers?.map((user,index) => (
  <Link  to={thisUser?.id !== user.id ? `/home/user/profile/${user.id}` : "/home/profile"} key={user.id} className={s.topUserContainer}>
    <span className={s.miniItem1}>
       <span>#{index + 1}</span>
      <img src={user.photo?.placed ? user.photo?.placed : user.photo?.default} alt="" />
        
    </span>
    <span className={s.miniItem2}>
      {user.username}
    </span>
    <span className={s.miniItem3}>
      {t('Posts')}: {user.postCount}
    </span>
  </Link>
));

    useEffect(()=>{
        if(openMenu && mobileMenuAnim.current){
            mobileMenuAnim.current.classList.add(s.mobileMenuAnim)
        } else if(!openMenu && mobileMenuAnim.current) {
            mobileMenuAnim.current.classList.remove(s.mobileMenuAnim)
        }
    },[openMenu])

    return (
        <main className={s.megaContainer}>
          {isWideScreen 
          ?  <div className={s.megaMobileContainer} ref={mobileMenuAnim}>
          <div className={s.mobileContent1}>
          <div className={s.Block1}>
          <div className={s.languageBlock}>
          <Language />
          </div>
            <Link className={activeLink === "/home" ? s.activeLink : s.link } onClick={()=>{
                setActiveLink("/home")
                localStorage.setItem("location","/home")
                setOpenMenu(false)
            }} to="/home"><HiHome/>{t('Home')}</Link>
            <Link className={activeLink === "/profile" ? s.activeLink : s.link } onClick={()=>{
                setActiveLink("/profile")
                localStorage.setItem("location","/profile")
                setOpenMenu(false)
            }} to="/home/profile"><FaUser />{t('Profile')}</Link>
            <Link className={activeLink === "/users" ? s.activeLink : s.link } onClick={()=>{
                setActiveLink("/users")
                localStorage.setItem("location","/users")
                setOpenMenu(false)
            }} to="/home/users"><FaUsers />{t('Users')}</Link>
            <Link className={activeLink === "/music" ? s.activeLink : s.link } onClick={()=>{
                setActiveLink("/music")
                localStorage.setItem("location","/music")
                setOpenMenu(false)
            }} to="/home/music"><FaMusic/>{t('Music')}</Link>
           
            </div>
            <div className={s.Block2}>

                        <span className={s.singnOut}> 
                            <button onClick={signOutHandler}>{t("Exit")}<IoExit /></button>
                        </span>
                           <Link className={s.settings} onClick={()=>{
                setActiveLink("/settings")
                setOpenMenu(false)
            }} to="/home/settings"><IoSettingsSharp/></Link>
                        
            </div>
            
            
            </div>
            <div className={s.mobileContent2}>

                <span onClick={()=>{setOpenMenu(false)}}><IoIosReturnLeft size="25" /></span>
            </div>
            </div> 

          :  <div className={s.content1}>
          <div className={s.Block1}>
            <Link className={activeLink === "/home" ? s.activeLink : s.link } onClick={()=>{
                setActiveLink("/home")
                localStorage.setItem("location","/home")
            }} to="/home"><HiHome/>{t('Home')}</Link>
            <NavLink className={activeLink === "/profile" ? s.activeLink : s.link } onClick={()=>{
                setActiveLink("/profile")
                localStorage.setItem("location","/profile")

            }} to="/home/profile"><FaUser />{t('Profile')}</NavLink>
            <Link className={activeLink === "/users" ? s.activeLink : s.link } onClick={()=>{
                setActiveLink("/users")
                localStorage.setItem("location","/users")

            }} to="/home/users"><FaUsers />{t('Users')}</Link>
            <Link className={activeLink === "/music" ? s.activeLink : s.link } onClick={()=>{
                setActiveLink("/music")
                localStorage.setItem("location","/music")
                
            }} to="/home/music"><FaMusic/>{t('Music')}</Link>
            
            </div>
          <div className={s.Block2}>

                         <span className={s.singnOut}> 
                            <button onClick={signOutHandler}>{t("Exit")}<IoExit /></button>
                        </span>
                        
                            <Link className={s.settings} onClick={()=>{
                
                setOpenMenu(false)
            }} to="/home/settings"><IoSettingsSharp/></Link>
                        
            </div>
            
            </div> }
            <div className={s.content2}>
            <Suspense fallback={<Loading />}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="music" element={<MusicPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="comment/post/:id" element={<CommentPage />} />
            <Route path="user/profile/:userId" element={<OtherPage />} />
            <Route path="profile/edit/post/:id" element={<EditPost />} />
            <Route path="user/profile/:userId/followers" element={<OtherFollowers />} />
            <Route path="user/profile/:userId/following" element={<OtherFollowing />} />
            <Route path="profile/followers" element={<MyFollowers />} />
            <Route path="profile/following" element={<MyFollowing />} />
            <Route path="updated" element={<UpdatedSitePage />} />
            <Route path="save" element={<SavePage />} />
            <Route path="notification" element={<NotificationPage />} />

            </Routes>
            </Suspense> 
            </div>
            <div className={s.content3}>
               {openUpdate ? <div className={s.miniContent1}>
                    <span className={s.item1}>{updatesArray[updatesArray?.length - 1].title}</span>
                    <span className={s.item2}>
                    {updatesArray[updatesArray?.length - 1].items?.map(item => <span>{item}</span>).slice(0,3)}

                    </span>
                    <span className={s.item3}>
                        <Link to="updated">Подробнее</Link>
                    </span>
                </div>
            : "" }
                <div className={s.miniContent2}>
                    <span className={s.item1}>{t('ActiveUsers')}</span>
                    <span className={s.item2}>
                        {topUsersList}
                    </span>
                </div>
            </div>
            {/* <div className={s.content4}> */}
            {/* {open ? <span className={s.item1}></span> : "" } */}
            {/* <span onClick={()=>{ */}
            {/*     setOpen((prevOpen)=> !prevOpen) */}
            {/* }} className={s.item2}><TbMessageCircle2Filled /></span>  */}
            {/* </div> */}
        </main>
    )
}

export default React.memo(Home);