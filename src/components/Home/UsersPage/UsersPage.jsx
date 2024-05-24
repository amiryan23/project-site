import s from './UsersPage.module.scss'
import { TbUserSearch } from "react-icons/tb";
import React,{ useState,useCallback,useEffect,useContext,useRef  } from 'react'
import { SlUserFollow,SlUserUnfollow } from "react-icons/sl";
import { RiUserFollowFill,RiUserUnfollowFill,RiUserReceivedFill  } from "react-icons/ri";
import { MyContext } from './../../../context/Context';
import {Link} from 'react-router-dom'
import MiniLoader from './../../MiniLoader/MiniLoader'
import { useFollowMutation , useUnfollowMutation  } from './../../../hooks/queryesHooks';
import { useQueryClient,useQuery } from 'react-query';




const UsersPage = ()=>{

	const [search,setSearch] = useState("")

 const {  t,setActiveLink} = useContext(MyContext);

const queryClient = useQueryClient();

 const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: thisUser } = useQuery('thisUser', () => queryClient.getQueryData('thisUser'));



const followMutation = useFollowMutation()
const unfollowMutation = useUnfollowMutation()

    const handleFollow = async ( user ) => {
    try {
      await followMutation.mutate({ user });
      console.log("добавлен в подписки ");
     
    } catch (error) {
      console.error("Ошибка при добавлен в подписки", error);
    }
  };

  const handleUnfollow = async (user) => {
  	try{
  		console.log('Запрос на отписку отправлен');
  		await unfollowMutation.mutate({ user });
      
  	}catch(error){
  		console.error("Ошибка при удаление подписки", error)
  	}
  }
 
	const animBlock = useRef()
 

 let timer;

 useEffect (()=>{
 	if(animBlock.current){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }

setActiveLink("/users")

 return () => {
 	if(animBlock.current){
 	animBlock.current.classList.remove(s.animBlock)
 	clearTimeout(timer)
 }
 }
 },[])


 // const memoizedHandleFollow = useCallback((thisUser, user)=>{
 // 	handleFollow(thisUser, user)
 // },[thisUser,users])  


 const usersArray = users ?
 users
 .filter(user => user.id !== thisUser?.id && user?.username?.toLowerCase().includes(search?.toLowerCase()))
 .map(m => 	<div key={m.id} className={s.userContainer}>
					<div className={s.userContent1}>
						<span>
						<Link to={`/home/user/profile/${m.id}`}><img src={m.photo?.placed ? m.photo?.placed : m.photo?.default} alt="" /></Link>
						</span>
						<span>{m.username}</span>
					</div>
					{/* <div className={s.userContent2}> */}
					{/* 	<span className={s.userItem1}> */}
					{/* 	<span className={s.item1}>Following</span> */}
					{/* 	<span className={s.item2}>{m.userData?.following ? m.userData.following?.length : 0}</span> */}
					{/* 	</span> */}
					{/* 	<span className={s.userItem1}> */}
					{/* 	<span className={s.item1}>Followers</span> */}
					{/* 	<span className={s.item2}>{m.userData?.followers ? m.userData.followers?.length : 0}</span>  */}
					{/* 	</span> */}
					{/* </div> */}
					<div className={s.userContent2}>
						{m.description ? m.description : "..."}
					</div>
					<div className={s.userContent3}>
					{m.userData && m.userData.requests?.includes(thisUser?.id)
					? <button className={s.btn3} onClick={()=>{handleFollow(m)}}><RiUserReceivedFill/>{t('Req')}</button>
					:
					thisUser?.userData && thisUser?.userData?.following?.includes(m.id)
					? <button className={s.btn2} onClick={()=>{handleUnfollow(m)}}><RiUserUnfollowFill/>{t('Unflw')}</button> 
					: <button className={s.btn1} onClick={()=>{handleFollow(m)}}><RiUserFollowFill/>{t('Flw')}</button>
					}
					</div>
				</div>)
 : <MiniLoader />

	return (

		<div className={s.megaContainer} ref={animBlock}>
			<div className={s.content1}>{t('SearchUsers')}</div>
			<div className={s.content2}>
				<TbUserSearch/><input value={search} onChange={(e)=>{setSearch(e.target.value)}} placeholder="Search user..." type="search" />
			</div>
			<div className={s.content3}>
			{usersArray ? usersArray : ""}
				
			</div>
			
		</div>
		
		)
}


export default React.memo(UsersPage)