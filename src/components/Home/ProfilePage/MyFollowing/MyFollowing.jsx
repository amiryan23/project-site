import s from './MyFollowing.module.scss'
import { AiOutlineRollback } from "react-icons/ai";
import React,{ useState,useCallback,useEffect,useContext,useRef} from 'react'
import { MyContext } from './../../../../context/Context';
import {useParams,Link} from "react-router-dom"
import { RiUserFollowFill,RiUserUnfollowFill,RiUserReceivedFill  } from "react-icons/ri";
import { useFollowMutation,useUnfollowMutation  } from './../../../../hooks/queryesHooks';
import { useQueryClient,useQuery } from 'react-query';





const MyFollowing = () => {

	const {userId} = useParams()

  const {t} = useContext(MyContext);


  const queryClient = useQueryClient();
 

const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: thisUser } = useQuery('thisUser', () => queryClient.getQueryData('thisUser'));

 const animBlock = useRef()

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
 

 let timer;

 useEffect (()=>{
 	if(animBlock.current){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }

 return () => {
 	if(animBlock.current){
 	animBlock.current.classList.remove(s.animBlock)
 	clearTimeout(timer)
 }
 }
 },[])

//   const selectedUser = users ? users.find((user) => {
//     if (userId && user && user.id.toString() === userId) {
//         return true;
//     }
//     return false;
// }) : null;


  const followingArray = thisUser?.userData?.following?.length > 0
  ?
  thisUser.userData?.following?.map(m => 
  	<div className={s.followingContent}>
  	<span className={s.item1}>
  	<Link to={`/home/user/profile/${users?.find(user => user.id === m).id}`}>
  	<img src={users?.find(user => user.id === m).photo?.placed || users?.find(user => user.id === m).photo?.default} alt="" />
  	</Link>
  	</span>
  	<span className={s.item2}>
  	<span className={s.miniItem1}>{users?.find(user => user.id === m).username}</span>
  	<span className={s.miniItem2}>
  	{users?.find(user => user.id === m).description?.length < 15
  	? users?.find(user => user.id === m).description
  	: `${users?.find(user => user.id === m).description?.slice(0,15) + "..."}` }
  	</span>

  	</span>
  	<span className={s.item3}>
  	{users?.find(user => user.id === m).id === thisUser.id 
  	? <span className={s.item}>You</span>
	: users?.find(user => user.id === m).userData && users?.find(user => user.id === m).userData?.requests?.includes(thisUser.id)
	? <button className={s.btn3} onClick={()=>{handleFollow(users?.find(user => user.id === m))}}><RiUserReceivedFill/>Request</button>
	:
	thisUser.userData && thisUser?.userData?.following?.includes(users?.find(user => user.id === m).id)
	? <button className={s.btn2} onClick={()=>{handleUnfollow(users?.find(user => user.id === m))}}><RiUserUnfollowFill/>Unfollow</button> 
	: <button className={s.btn1} onClick={()=>{handleFollow(users?.find(user => user.id === m))}}><RiUserFollowFill/>Follow</button>
	
	}			
  	</span>
  	</div>)
  : <div className={s.noFollowing}>{t('NoFollowing')}</div>

	return (
		<div className={s.megaContainer} ref={animBlock}>
		<div className={s.content1}>
			<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button>
			<span className={s.item1}>Following </span>
			<span className={s.item2}>{thisUser.userData?.following?.length}</span>
		</div>	
		<div className={s.content2}>
			{thisUser && followingArray}
		</div>
		</div>
		)
}


export default MyFollowing
