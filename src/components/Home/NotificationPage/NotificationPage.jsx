import s from './NotificationPage.module.scss'
import { IoMdNotifications,IoMdNotificationsOff  } from "react-icons/io";
import { MyContext } from './../../../context/Context';
import React,{ useState,useEffect,useContext } from 'react'
import { useQueryClient,useQuery } from 'react-query';
import {Link} from 'react-router-dom'

const NotificationPage = () => {

 const queryClient = useQueryClient();

	const {  thisUser,t,setActiveLink,calculateTimeDifference } = useContext(MyContext);
	const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));

	const newNotificArray = thisUser &&
	thisUser?.notifications?.map(m => 
		<Link to={`/home/comment/post/${m.postId}`} className={s.notificContent}>
			<span className={s.miniItem1}>
				<Link to={`/home/user/profile/${users?.find(user => user.id === m.fromUser).id}`}>
				<img src={users.find(user => user.id === m.fromUser).photo?.placed ? users.find(user => user.id === m.fromUser).photo?.placed  : users.find(user => user.id === m.fromUser).photo?.default} alt="" />
				</Link>
			</span>
			<span className={s.miniItem2}>
				<span className={s.block1}>{users ? users?.find(user => user.id === m.fromUser).username : "" }</span>

				<span className={s.block2}>{m.type === "Like" && t('NotificLike') || m.type === "Comment" && t('NotificComment')}</span>
			</span>
			<span className={s.miniItem3}>
				{calculateTimeDifference(m.timestamp)}
			</span>
		</Link>) 
	

	return (
		<div className={s.megaContainer}>
			<div className={s.content1}><IoMdNotifications/>Notifications</div>
			<div className={s.content2}>
				{thisUser ? newNotificArray?.reverse() : ""}
			</div>
			

		</div>
		)
}


export default NotificationPage;