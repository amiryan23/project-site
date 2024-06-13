import s from './NotificationPage.module.scss'
import { IoMdNotifications,IoMdNotificationsOff  } from "react-icons/io";
import { MyContext } from './../../../context/Context';
import React,{ useState,useEffect,useContext,useRef } from 'react'
import { useQueryClient,useQuery } from 'react-query';
import {Link} from 'react-router-dom'
import {db} from './../../../firebase.js'
import {   doc, getDoc , updateDoc } from "firebase/firestore";
import { useAcceptRequest,useCancelRequest}  from './../../../hooks/queryesHooks'
import {MdDeleteForever} from "react-icons/md";
import { FaReadme } from "react-icons/fa6";

const NotificationPage = () => {

 const queryClient = useQueryClient();

	const {  thisUser,t,setActiveLink,calculateTimeDifference ,setNotificText} = useContext(MyContext);
	const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));

	const acceptRequest = useAcceptRequest()
	const cancelRequest = useCancelRequest()


const animBlock = useRef()

	 let timer;

 useEffect (()=>{
 	if(animBlock.current){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }

setActiveLink("/home")
 
 return () => {
 	if(animBlock.current){
 	animBlock.current.classList.remove(s.animBlock)
 	clearTimeout(timer)
 }
 }
 },[])

	const markAllNotificationsAsRead = async () => {
    try {
    	if(thisUser?.notifications?.some(m => !m.read)){
        const userDocRef = doc(db, "users", thisUser?.id);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
            
            if (thisUser.notifications) {
                const updatedNotifications = thisUser?.notifications?.map(notification => {
                    return { ...notification, read: true };
                });

             const updatedUser = {
              ...thisUser,
              notifications: updatedNotifications,
            };               
                queryClient.setQueryData('thisUser', updatedUser);
                await updateDoc(userDocRef, { notifications: updatedNotifications });
                setNotificText(t('NotificRead'))
                
            } else {
                console.log("User has no notifications to mark as read");
            }
        } else {
            console.log("User document not found:");
        }
    }
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
    }
};


	const acceptRequesthandle = async (user) => {
		try{
			await acceptRequest.mutate({ user });
      		console.log("добавлен в подписки ");
      		setNotificText(t('NotificAccept'))
		} catch (error) {
			console.error("Ошибка",error)
		}
	}

	const cancelRequesthandle = async (user) => {
		try{
			await cancelRequest.mutate({ user });
      		console.log("добавлен в подписки ");
      		setNotificText(t('NotificReject'))
		} catch (error) {
			console.error("Ошибка",error)
		}
	}



const getNotificationText = (type) => {
  switch(type) {
    case "Like":
      return t('NotificLike');
    case "Comment":
      return t('NotificComment');
    case "Tagged":
      return t('TaggedPost');
    default:
      return "";
  }
};




	const requestsNotifix = thisUser
	? 
	thisUser.userData?.requests?.map((m,index) => 
		<span key={index} className={s.notificContent}>
			<span className={s.miniItem1}>
				<Link to={`home/user/profile/${users?.find(user => user.id === m).id}`}>
				<img src={users?.find(user => user.id === m).photo?.placed ? users?.find(user => user.id === m).photo?.placed  : users?.find(user => user.id === m).photo?.default} alt="" />
				</Link>
			</span>
			<span className={s.miniItem2}>
				<span className={s.block1}>{users ? users?.find(user => user.id === m).username : "" }</span>

				<span className={s.block2}>{t("Request")}</span>
			</span>
			<span className={s.miniItem3}>
				<button className={s.btn1} onClick={()=>{acceptRequesthandle(users?.find(user => user.id === m))}}>{t("Accept")}</button>
				<button className={s.btn2} onClick={()=>{cancelRequesthandle(users?.find(user => user.id === m))}}><MdDeleteForever /></button>
			</span>
		</span>) 
	: ""

	const newNotificArray = thisUser &&
	thisUser?.notifications?.map((m,index) => 
		<Link key={index}  to={`/home/comment/post/${m.postId}`} className={!m.read ? `${s.notificContent} + ${s.readNotific}` : s.notificContent}>
			<span className={s.miniItem1}>
				<Link to={`/home/user/profile/${users?.find(user => user.id === m.fromUser).id}`}>
				<img src={users.find(user => user.id === m.fromUser).photo?.placed ? users.find(user => user.id === m.fromUser).photo?.placed  : users.find(user => user.id === m.fromUser).photo?.default} alt="" />
				</Link>
			</span>
			<span className={s.miniItem2}>
				<span className={s.block1}>{users ? users?.find(user => user.id === m.fromUser).username : "" }</span>

				<span className={s.block2}>{getNotificationText(m.type)}</span>

				<span className={s.block3}>
				{ arrayPosts?.find(post=> post.id === m.postId)?.postText === ""
				? `(Photo)` 
				: `${arrayPosts?.find(post=> post.id === m.postId)?.postText.slice(0,25)}...` }</span>
			</span>
			<span className={s.miniItem3}>
				{calculateTimeDifference(m.timestamp)}
			</span>
		</Link>) 
	

	return (
		<div className={s.megaContainer} ref={animBlock}>
			<div className={s.content1} ><IoMdNotifications/>{t('Notifics')}</div>
			<div className={s.content}><button onClick={markAllNotificationsAsRead}>{t('MarkAllNotific')}<FaReadme /></button></div>
			<div className={s.content2}>
			{thisUser?.userData?.requests?.length > 0
			? <span className={s.miniContent1}>
			  <span>{t('SubReq')}</span>
				{thisUser ? requestsNotifix?.reverse() : ""}
				</span>
			: ""}
			{thisUser?.notifications !== undefined 
			? <span className={s.miniContent1}>
			<span>{t('OtherNotific')}</span>
				{thisUser ? newNotificArray?.reverse().slice(0,6) : ""}
			</span>
			: ""}

			</div>
			

		</div>
		)
}


export default React.memo(NotificationPage);