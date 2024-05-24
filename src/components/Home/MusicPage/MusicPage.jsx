import s from "./MusicPage.module.scss"
import React,{ useState,useCallback,useEffect,useContext,useRef } from 'react'
import { MyContext } from './../../../context/Context';



const MusicPage = () =>{
 const { setActiveLink } = useContext(MyContext);

 useEffect(()=>{
 	setActiveLink("/music")
 },[])

	return (
		<div className={s.megaContainer}>
			Coming Soon...
		</div>
		)
}

export default MusicPage