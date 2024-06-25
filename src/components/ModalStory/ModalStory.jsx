import s from './ModalStory.module.scss'
import ReactDOM from 'react-dom';
import { IoMdClose } from "react-icons/io";
import { MyContext } from './../../context/Context';
import { IoMdCloseCircle } from "react-icons/io";
import { useQueryClient,useQuery } from 'react-query';
import React,{ useState,useCallback,useEffect,useContext,useRef} from 'react'
import { MdDelete } from "react-icons/md";
import {useAddStory} from './../../hooks/queryesHooks'

const ModalStory = ()=>{


  const {thisUser,users, openStoryModal,setOpenStoryModal,setNotificText,viewStory,setViewStory,calculateTimeDifference } = useContext(MyContext);
  const queryClient = useQueryClient();
  const [fileUrl, setFileUrl] = useState(null);
  const [width,setWidth] = useState(100)

  const fileRef = useRef()

  const thisUserIdStory = JSON.parse(localStorage.getItem("storyData"))
  const thisUserStoryData = JSON.parse(localStorage.getItem('thisUserStoryData'))

// const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));

 const addStoryMutation = useAddStory()

  const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setFileUrl({
      	file:file,
      	url:url
      });
      
    
    }
  };

  const handlerAddStory = async (thisUser,fileUrl) => {
  	try{
  		await addStoryMutation.mutate({thisUser,fileUrl})
			console.log("успешно добале")
			setNotificText("Story added")
			setTimeout(()=>{
				setOpenStoryModal(false)
				setFileUrl(null)},150)

  	}catch(error){
  		console.error(error)
  	}
  }

  let timer1;
  let timer2;

  useEffect(()=>{
  	if(viewStory){
  	timer1 = setTimeout(()=>{setViewStory(false)
  			setOpenStoryModal(false)},7000)
  	timer2 = 	setInterval(()=>setWidth((prevWidth)=>prevWidth - 1),70)
  	}

  	return () => {
  		clearTimeout(timer1)
  		clearInterval(timer2)
  		if(!viewStory){
  			setWidth(100) }
  		}
  	},[viewStory])

	return ReactDOM.createPortal(
		
		<dialog className={s.Container} open={openStoryModal} >
		<input type="file" id="addStory" onChange={handleFileChange}/>
			<div  className={s.content} 
			style={{
			 backgroundImage: fileUrl ? `url(${fileUrl.url})` : viewStory ? `url(${users?.find(user=> user.id === thisUserStoryData)?.storyArray[0]?.fileURL})` : undefined,
			backgroundColor: fileUrl || viewStory  ? 'rgba(0, 0, 0, 1)' : undefined}}>
				<div className={s.content1}>
				<div className={s.block1} style={{width:`${width}%`}}></div>
				<div className={s.block2}>
				<span className={s.miniBlock}> 
					<img src={viewStory ?  users?.find(user=> user.id === thisUserStoryData)?.photo?.placed || users?.find(user=> user.id === thisUserStoryData)?.photo?.default  : thisUserIdStory?.photo} alt="" />
					<span className={s.item}>
						<span className={s.miniItem1}>{viewStory ? users?.find(user=> user.id === thisUserStoryData)?.username : "You"}</span>
						<span className={s.miniItem2}>{viewStory ? calculateTimeDifference(users?.find(user=> user.id === thisUserStoryData)?.storyArray[0]?.timeAdded) : ""}</span>
					</span>
				</span>
					<span onClick={()=>{
						setOpenStoryModal((prevOpenStoryModal)=>false)
						setViewStory((prevViewStory)=>false)
						setTimeout(()=>{
							localStorage.removeItem("storyData")
							localStorage.removeItem("thisUserStoryData")},150)
					}}><IoMdCloseCircle /></span>
				</div>
				</div>
				{!fileUrl 
				? <label htmlFor="addStory" className={s.content2}>Upload photo/video </label> 
				: <div className={s.content3}>
					<button onClick={()=>{handlerAddStory(thisUser,fileUrl)}} className={s.item1}>Add Story</button>
					<span className={s.item2} onClick={()=>{setFileUrl(null)}}><MdDelete /></span>
				</div>}

			</div>
		</dialog>,document.getElementById('story')
		)
}

export default ModalStory