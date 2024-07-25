import s from "./MusicPage.module.scss"
import React,{ useState,useCallback,useEffect,useContext,useRef } from 'react'
import { MyContext } from './../../../context/Context';
import { useQueryClient,useQuery } from 'react-query';
import { FaCirclePlay  } from "react-icons/fa6";
import { FaPauseCircle } from "react-icons/fa";
import { TbMusicPlus } from "react-icons/tb";
import {Link} from 'react-router-dom'
import { TbMusicSearch } from "react-icons/tb";
import { AiOutlineRollback } from "react-icons/ai";

const MusicPage = () =>{
 const { setActiveLink,srcMusicId,setSrcMusicId,logined } = useContext(MyContext);
 const [play,setPlay] = useState({})
 const [search,setSearch] = useState(null)

 const queryClient = useQueryClient();

 const { data: musicsArray } = useQuery('musicsArray', () => queryClient.getQueryData('musicsArray'));

const playMusic = (musicId,musicSrc) => {
    setPlay((prevPlay) => ({
        ...prevPlay,
        musicId: musicId,
        playMusic: true
    }));
    setSrcMusicId(musicSrc)
};


const animBlock = useRef()


 let timer;

 useEffect (()=>{
 	if(animBlock.current){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }

 setActiveLink("/profile")

 return () => {
 	setSrcMusicId((prevMusicId)=>null)
 	if(animBlock.current){
 	animBlock.current.classList.remove(s.animBlock)
 	clearTimeout(timer)
 }
 }
 },[])

const pauseMusic = (musicId) => {
    setPlay((prevPlay) => ({
        ...prevPlay,
        musicId: musicId,
        playMusic: false
    }));
    setSrcMusicId(null)
};

const newMusicsArray = musicsArray 
? musicsArray.filter(music => search !== null ? music.trackName.toLowerCase().includes(search) : music).map(m => 
<div className={s.musicContainer} key={m.id}>
	<div className={s.musicContent1} style={{backgroundImage:`url(${m.trackImgUrl})`}}>
		<span>
		{play.musicId === m.id && play.playMusic === true
		? <span onClick={()=>{pauseMusic(m.id)}}><FaPauseCircle /> </span>
		: <span onClick={()=>{playMusic(m.id,m.urlTrack)}}><FaCirclePlay /> </span> }
	</span>
	</div>
	<div className={s.musicContent2}>{m.trackName}</div>

	
</div>
)
: ""

 useEffect(()=>{
 	setActiveLink("/music")
 },[])

	return (
		logined 
		? <div className={s.megaContainer} ref={animBlock}>
	
	<div className={s.content1}>
		<span>
		<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button>Music
		</span>
		<Link to ="/home/music/add"><TbMusicPlus /></Link>
	</div>
	<div className={s.content2}>
		<TbMusicSearch /><input type="search" value={search} onChange={(e)=>{setSearch(e.target.value)}} />
	</div>
	<div className={s.content3}>
		{newMusicsArray}
	</div>
	
		
			
		</div>
		: <div className="noLogined">You are not authorized <Link to="/" className="btnLogin">Login</Link></div>
		)
}

export default MusicPage