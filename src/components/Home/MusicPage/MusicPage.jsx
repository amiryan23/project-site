import s from "./MusicPage.module.scss"
import React,{ useState,useCallback,useEffect,useContext,useRef } from 'react'
import { MyContext } from './../../../context/Context';
import { useQueryClient,useQuery } from 'react-query';
import { FaCirclePlay  } from "react-icons/fa6";
import { FaPauseCircle } from "react-icons/fa";
import { TbMusicPlus } from "react-icons/tb";
import {Link} from 'react-router-dom'


const MusicPage = () =>{
 const { setActiveLink,srcMusicId,setSrcMusicId } = useContext(MyContext);
 const [play,setPlay] = useState({})

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


useEffect(()=>{

	return () => {
		setSrcMusicId(null)
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
? musicsArray.map(m => 
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
		<div className={s.megaContainer}>
	
	<div className={s.content1}>
		<span>Music</span><Link to ="/home/music/add"><TbMusicPlus /></Link>
	</div>
	<div className={s.content2}>
		<input type="search" />
	</div>
	<div className={s.content3}>
		{newMusicsArray}
	</div>
	
		
			
		</div>
		)
}

export default MusicPage