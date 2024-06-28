import s from './ArchivePage.module.scss'
import { AiOutlineRollback } from "react-icons/ai";
import React,{ useState,useEffect,useContext,useRef} from 'react'
import { MyContext } from './../../../context/Context';
import { IoEyeSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { BsHighlights } from "react-icons/bs";

const ArchivePage = () => {

	const { thisUser,setSrcMusicId } = useContext(MyContext);
	const [hidden,setHidden] = useState({})

	const animBlock = useRef()

	let timer;

	 useEffect (()=>{
	if(animBlock.current){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }

return () => {
	setSrcMusicId((prevMusicId)=>null)
	if(animBlock.current){
	animBlock.current.classList.remove(s.animBlock)
	clearTimeout(timer)
 }
 }
 },[])

	const storyArchive = thisUser 
	? thisUser?.storyArray?.map(story=> <div className={s.storyContainer} onMouseLeave={()=>{setHidden(null)}} onMouseOver={()=>{setHidden(story.id)}} style={{backgroundImage:`url(${story.fileURL})`}}>
		<div className={s.storyContent1}>{story?.timeAdded}</div>
		
		<div className={hidden === story.id ? `${s.activeStory} ${s.storyContent2}` : s.storyContent2}>
			<button className={s.btn1}>Add to highlights <BsHighlights/> </button>
			<button className={s.btn2}>Delete <MdDelete/></button>
		</div> 
		<div className={s.storyContent3}>
		<span className={s.item1}>{story?.storyText}</span>
		<span className={s.item2}><IoEyeSharp />{story?.view?.length || 0}</span>
		</div>
	</div>)
	: <div className={s.noStory}>You don't have a story yet</div>
 	return (
		<div className={s.megaContainer} ref={animBlock}>
			<div className={s.content1}>
				<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button> Archive
			</div>
			<div className={s.content2}>
				{thisUser && storyArchive?.reverse()}
			</div>
			<div className={s.content3}></div>
		</div>
		)
} 

export default ArchivePage