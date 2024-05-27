import s from './UpdatedSitePage.module.scss'
import { AiOutlineRollback } from "react-icons/ai";
import { MyContext } from './../../context/Context';
import React,{ useState,Suspense,useContext,useRef,useEffect} from 'react';



const UpdatedSitePage = () => {

     const {  openUpdate,setOpenUpdate} = useContext(MyContext);

     useEffect(()=>{
     	if(openUpdate){
     		setOpenUpdate(false)
     	}

     	return () => {
     	setOpenUpdate(true)
     }
     },[])


	return (
		<div className={s.megaContainer}>
			 <span className={s.item1}>
			 <button onClick={() => {


			 	window.history.back(-1)

			 }


			 }><AiOutlineRollback size="30" color="whitesmoke"/></button>
			 <span>Обновления 1.0.2</span>
			 </span>
                    <span className={s.item2}>
                        <br /><br />
                        1. Исправлена онлайн/оффлайн функция для мобильных устройств.
                        <br /><br />
                        2. Теперь можно отвечать на комментарии.
                        <br /><br />
                        3. Глубокая адаптация под мобильные устройства.
                        <br /><br />
                        4. Теперь отображается онлайн/оффлайн статус в постах и комментариях.
                        <br /><br />
                        5. Исправлены баги.

                    </span>
		</div>
		)
}


export default UpdatedSitePage