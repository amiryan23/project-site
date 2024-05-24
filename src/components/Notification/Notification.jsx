import s from './Notification.module.scss'
import React,{ useState,useCallback,useEffect,useContext,useRef} from 'react'
import { MyContext } from './../../context/Context';
import { FaCircleCheck } from "react-icons/fa6";

const Notification = () => {


 const {  notificText,setNotificText} = useContext(MyContext);

const notificAnim = useRef()



useEffect(()=>{
	
	if(notificText){
	setTimeout(()=>{
		notificAnim.current.classList.add(s.notificAnim)
		notificAnim.current.classList.remove(s.megaContainer)

	},50)
	setTimeout(()=>{
		notificAnim.current.classList.remove(s.notificAnim)
		notificAnim.current.classList.add(s.megaContainer)

	},3000)
	setTimeout(()=>{setNotificText("")},3500)
} 
	


},[notificText])

	return (
		<>
		{notificText
		? <div className={s.megaContainer} ref={notificAnim}>
			<div className={s.content}>
				<FaCircleCheck />
				<span>{notificText}</span>
				
			</div>
		</div>
		: "" }
		</>
		)
}


export default Notification