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
			 <span>Обновления 1.0.1</span>
			 </span>
                    <span className={s.item2}>
                        Начало бета-тестирования сайта 24.05.2024
                        <br /><br />
                        1. Добавлена функция добавления/удаления постов.
                        <br /><br />
                        2. Добавлена функция добавления/удаления подписок.
                        <br /><br />
                        3. Добавлена функция лайк/дизлайк/комментирования.
                        <br /><br />
                        4. Теперь можно пересылать посты других пользователей.
                        <br /><br />
                        5. Теперь можно изменить имя, возраст, город, страну и фото профиля.
                        <br /><br />
                        6. Обновления с валидацией на страницах регистрации и логина.
                        <br /><br />
                        7. Добавлены три языка на сайт: русский, английский и армянский.
                        <br /><br />
                        8. Добавлена функция онлайн/оффлайн.
                        <br /><br />
                        9. Добавлена функция для изменения своего профиля и постов.
                        <br /><br />
                        10. Фиксация много багов

                    </span>
		</div>
		)
}


export default UpdatedSitePage