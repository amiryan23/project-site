import s from './Notification.module.scss'
import React,{ useState,useCallback,useEffect,useContext,useRef} from 'react'
import { MyContext } from './../../context/Context';
import { FaCircleCheck } from "react-icons/fa6";

const Notification = () => {


 const {  notificText,setNotificText} = useContext(MyContext);

const notificAnim = useRef()

const [widthTimer,setWidthTimer] = useState(100)


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

  useEffect(() => {
    let interval;
    if (widthTimer > 0 && notificText) {
      interval = setInterval(() => {
        setWidthTimer((prevWidthTimer) => prevWidthTimer - 1);
      }, 24); // Adjust the decrement and interval as needed
    }

    if(!notificText){
    	setWidthTimer(100)
    }

    return () => {
      clearInterval(interval);
    };
  }, [widthTimer, notificText]);

	return (
		<>
		{notificText
		? <div className={s.megaContainer} ref={notificAnim}>
			<div className={s.content}>
		{notificText ?	<div className={s.timer} style={{width:`${widthTimer}%`}}></div> : "" }
				<div className={s.notificContent}>
				<FaCircleCheck />
				<span>{notificText}</span>
				</div>
				
			</div>
		</div>
		: "" }
		</>
		)
}


export default Notification