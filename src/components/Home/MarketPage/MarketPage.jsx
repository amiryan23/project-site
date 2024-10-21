import s from './MarketPage.module.scss'
import { AiOutlineRollback } from "react-icons/ai";
import { MyContext } from './../../../context/Context';
import React,{useState,useContext} from 'react'

const MarketPage = () => {

 const {  thisUser,logined } = useContext(MyContext);

	return (
		<div className={s.megaContainer}>
			<div className={s.content1}>
				<span className={s.item1}>
				<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button>
				Market
				</span>
				<span className={s.item2}>Balance: {thisUser?.coscoin && thisUser?.coscoin != undefined && thisUser?.coscoin != 0 ? thisUser?.coscoin : "0" } Cospoint</span>
			</div>
			<div className={s.content2}>
			
			</div>
		</div>
		)
	}

export default MarketPage