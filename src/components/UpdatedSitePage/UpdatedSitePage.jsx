import s from './UpdatedSitePage.module.scss'
import { AiOutlineRollback } from "react-icons/ai";
import { MyContext } from './../../context/Context';
import React,{ useState,Suspense,useContext,useRef,useEffect} from 'react';
import { IoMdAddCircle } from "react-icons/io";
import {updatesArray} from './../../helper/updatesArray'
import { FaGripLines } from "react-icons/fa";


const UpdatedSitePage = () => {

     const {  openUpdate,setOpenUpdate , thisUser,setActiveLink} = useContext(MyContext);

     const animBlock = useRef()
    
     let timer;


     useEffect(()=>{
     	if(openUpdate){
     		setOpenUpdate(false)
     	}

        if(animBlock.current){
         timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
         }

         setActiveLink("/")

        
     	return () => {
     	setOpenUpdate(true)
           if(animBlock.current){
    animBlock.current.classList.remove(s.animBlock)
    clearTimeout(timer) }
     }
     },[])


     const newUpdateArray = updatesArray &&
     updatesArray.map(m => 
        <>
        <div className={s.container} key={m.id}>
            <div className={s.content1}>
            <span className={s.miniBlock1}>{m.title}</span>
            <span className={s.miniBlock2}>{m.description}</span>
            </div>
            <div className={s.content2}>
                {m.items.map(item => <span>{item}</span>)}
            </div>
            <div className={s.content3}>{m.timeData}</div>
        </div>
        <span className={s.miniContent}><FaGripLines /></span>
        </>)



	return (
		<div className={s.megaContainer} ref={animBlock}>
			 <span className={s.item1}>
             <span className={s.miniItem1}>
			 <button onClick={() => { window.history.back(-1)}}><AiOutlineRollback size="30" color="whitesmoke"/></button>
			 <span>Обновления</span>
             </span>
             {thisUser?.isAdmin 
             ?<span className={s.miniItem2}>
                 <IoMdAddCircle />
             </span>
             : ""}
			 </span>
                    <span className={s.item2}>
                        {newUpdateArray.reverse()}
                    </span>
		</div>
		)
}


export default UpdatedSitePage