import s from './NotificationUser.module.scss'
import { IoMdNotifications,IoMdNotificationsOff  } from "react-icons/io";
import React,{ useState,useCallback,useEffect,useContext,useRef } from 'react'
import { MyContext } from './../../../context/Context';
import {MdDeleteForever} from "react-icons/md";
import {Link} from 'react-router-dom'
// import { useAcceptRequest, useCancelRequest } from './../../../context/auth';
import { useAcceptRequest,useCancelRequest}  from './../../../hooks/queryesHooks'
import { useQueryClient,useQuery } from 'react-query';




const NotificationUser = ({openNotific,setOpenNotific}) =>{
	

     const { setNotificText, t} = useContext(MyContext);


	const notificAnim = useRef()

	const acceptRequest = useAcceptRequest()
	const cancelRequest = useCancelRequest()
	const queryClient = useQueryClient();


const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: thisUser } = useQuery('thisUser', () => queryClient.getQueryData('thisUser'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));

	useEffect(()=>{
		if(openNotific){
			setTimeout(()=>{
				notificAnim.current.classList.add(s.notificAnim)
				notificAnim.current.classList.remove(s.item2)

			},50)
		} else if(!openNotific && notificAnim.current){
			notificAnim.current.classList.add(s.item2)
			setTimeout(()=>{
				notificAnim.current.classList.remove(s.notificAnim)
				

			},50)
		}
	},[openNotific])


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
	thisUser.userData?.requests?.map(m => 
		<span  className={s.requestsContent}>
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

	const lastNotific = thisUser 
	? 	thisUser?.notifications?.map(m => 
		<Link to={`/home/comment/post/${m.postId}`}  className={s.notificContent}>
			<span className={s.miniItem1}>
				<Link to={`home/user/profile/${users?.find(user => user.id === m.fromUser).id}`}>
				<img src={users?.find(user => user.id === m.fromUser).photo?.placed ? users?.find(user => user.id === m.fromUser).photo?.placed  : users?.find(user => user.id === m.fromUser).photo?.default} alt="" />
				</Link>
			</span>
			<span className={s.miniItem2}>
				<span className={s.block1}>{users ? users?.find(user => user.id === m.fromUser).username : "" }</span>

				<span className={s.block2}>{getNotificationText(m.type)}</span>
				<span className={s.block3}>
				{ arrayPosts?.find(post=> post.id === m.postId)?.postText === ""
				? "(Photo)" 
				: `${arrayPosts?.find(post=> post.id === m.postId)?.postText?.slice(0,25)}...` }</span>
			</span>

		</Link>) 
	: ""

return (
  <span className={s.miniContent}>
    <span className={s.item1} onClick={() => setOpenNotific((prevOpenNotific) => !prevOpenNotific)}>
      <IoMdNotifications />
      {(thisUser?.userData?.requests?.length > 0 || (thisUser?.notifications?.filter(m => m.read === false)?.length > 0)) ? (
        <span>
          {(thisUser?.userData?.requests?.length || 0) + (thisUser?.notifications?.filter(m => m.read === false)?.length || 0)}
        </span>
      ) : ""}
    </span>
    <span ref={notificAnim} className={s.item2}>
      <Link onClick={() => setOpenNotific((prevOpenNotific) => !prevOpenNotific)} to="/home/notification" className={s.miniBlock1}>{t('SeeAllNot')}</Link>
      <hr />
      <span className={s.Block}>
        {(thisUser?.userData?.requests?.length > 0 || (Array.isArray(thisUser?.notifications) && thisUser.notifications.length > 0)) ? (
          <>
            {requestsNotifix}
            {lastNotific?.[lastNotific.length - 1]}
          </>
        ) : (
          <span className={s.notNotific}>
            {t('noNotific')} <IoMdNotificationsOff />
          </span>
        )}
      </span>
    </span>
  </span>
);
}


export default React.memo(NotificationUser)