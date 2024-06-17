import s from './AddMusicPage.module.scss'
import React,{ useState,useCallback,useEffect,useContext,useRef,Suspense} from 'react'
import { AiFillFileAdd } from "react-icons/ai";
import {useAddMusic} from './../../../../hooks/queryesHooks'
import { useQueryClient,useQuery } from 'react-query';
import { MyContext } from './../../../../context/Context.js';
import { MdFileDownloadDone } from "react-icons/md";
import { AiOutlineRollback } from "react-icons/ai";

const AddMusicPage = () => {

	const [trackName,setTrackName] = useState(null)
	const [trackImgUrl,setTrackImgUrl] = useState(null)
	const [urlTrack,setUrlTrack] = useState(null)
	const [fileUrl, setFileUrl] = useState(null);
	const [fileTrackUrl, setFileTrackUrl] = useState(null);
	const [thisFileName,setThisFileName] = useState(null);

	 const {  thisUser , setNotificText ,setActiveLink } = useContext(MyContext);

 const queryClient = useQueryClient();


const addMusicMutation = useAddMusic();


const imageRef = useRef(null)
const trackRef = useRef(null)

const animBlock = useRef()

 let timer;

 useEffect (()=>{
 	if(animBlock.current){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }

 setActiveLink("/music")

 return () => {
 
 	if(animBlock.current){
 	animBlock.current.classList.remove(s.animBlock)
 	clearTimeout(timer)
 }
 }
 },[])

	  const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFileUrl(url);

    
    }
  };

    const handleTrackChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFileTrackUrl(url);
      setUrlTrack(file);
      setThisFileName(file.name);
    }
  };

  const handleTrackNameChange = (e) => {
    setTrackName(e.target.value);
  };


	   const handleAddMusic = async (thisUser,trackName,imageRef,trackRef) => {
    try {
      await addMusicMutation.mutate({ thisUser,trackName,imageRef,trackRef });
      console.log("New Track Added");
      setTrackName(null)
      setFileUrl(null)
      setThisFileName(null);
      setNotificText("New Track Added")

    } catch (error) {
      console.error("Ошибка при обновлении лайка к посту:", error);
    }
  };


	return (
		<div className={s.megaContainer} ref={animBlock}>
			<div className={s.content1}>
				<span>
		<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button>Add Music
		</span>
			<button onClick={()=>{handleAddMusic(thisUser,trackName,imageRef,trackRef)}}><span>Add</span><MdFileDownloadDone/></button>
			</div>
			<div className={s.content2}>
				<span className={s.item1}>
				<input ref={imageRef} id="photo" type="file" onChange={handleFileChange} />
				Add Photo Track (400x400)
				<label style={{backgroundImage:`url(${fileUrl})`}} htmlFor="photo" className={s.label1}>Add Photo</label>
				</span>
				<span className={s.item2}>
				Track Name
				<input type="text" onChange={handleTrackNameChange}/>
				</span>
				<span className={s.item1}>
				Track File
				<input ref={trackRef} id="music" type="file" onChange={handleTrackChange}/>
				<label htmlFor="music" className={s.label2} ><AiFillFileAdd/></label>
				{thisFileName && (
              <div className={s.fileName}>Audio File: {thisFileName}</div>
            	)}
				</span>
			</div>
			<div className={s.content3}>
				
			</div>
		</div>
		)
}

export default AddMusicPage