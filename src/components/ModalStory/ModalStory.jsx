import s from './ModalStory.module.scss'
import ReactDOM from 'react-dom';
import { IoMdClose } from "react-icons/io";
import { MyContext } from './../../context/Context';
import { IoMdCloseCircle } from "react-icons/io";
import { useQueryClient,useQuery } from 'react-query';
import React,{ useState,useCallback,useEffect,useContext,useRef} from 'react'
import { MdDelete } from "react-icons/md";
import {useAddStory,useDeleteStory} from './../../hooks/queryesHooks'
import { IoEyeSharp } from "react-icons/io5";
import { FaPhotoFilm } from "react-icons/fa6";

const ModalStory = ()=>{


  const {thisUser,users, openStoryModal,setOpenStoryModal,setNotificText,viewStory,setViewStory,calculateTimeDifference } = useContext(MyContext);
  const queryClient = useQueryClient();
  const [fileUrl, setFileUrl] = useState(null);
  const [width,setWidth] = useState(100)
  const [storyText,setStoryText] = useState(null)

  const fileRef = useRef()

  const thisUserIdStory = JSON.parse(localStorage.getItem("storyData"))
  const thisUserStoryData = JSON.parse(localStorage.getItem('thisUserStoryData'))

// const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));

 const addStoryMutation = useAddStory()
 const deleteStoryMutation = useDeleteStory()

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

  const handlerAddStory = async (thisUser,fileUrl,storyText) => {
  	try{
  		await addStoryMutation.mutate({thisUser,fileUrl,storyText})
			console.log("успешно добале")
			setNotificText("Story added")
			setTimeout(()=>{
				setOpenStoryModal(false)
				window.location.href = "/home/profile"
				setFileUrl(null)},3500)


  	}catch(error){
  		console.error(error)
  	}
  }

  const handlerDeleteStory = async (idToDelete,thisUser) => {
  	try{
  		await deleteStoryMutation.mutate({idToDelete,thisUser})
  		console.log("deleted")
  		setNotificText("Story deleted")
  		setOpenStoryModal(false)
  	} catch (error) {
  		console.error(error)
  	}
  }

  let timer1;
  let timer2;
  let timer3;

  useEffect(()=>{
  	if(viewStory){
  	timer1 = setTimeout(()=>{
  			setOpenStoryModal(false)},7000)
  	timer2 = 	setInterval(()=>setWidth((prevWidth)=>prevWidth - 1),70)
  	timer3 = setTimeout(()=>{setViewStory(false)},7150)
  	}

  	return () => {
  		clearTimeout(timer1)
  		clearInterval(timer2)
  		clearTimeout(timer3)
  		if(!viewStory){
  			setWidth(100) }
  		}
  	},[viewStory])

  

	return ReactDOM.createPortal(
		
		<dialog className={s.Container} open={openStoryModal} >
		<input className={s.input1} type="file" accept="image/*" id="addStory" onChange={handleFileChange}/>
			<div  className={s.content} 
			style={{
			 backgroundImage: fileUrl ? `url(${fileUrl.url})` : viewStory ? `url(${users?.find(user=> user.id === thisUserStoryData)?.storyArray[users?.find(user => user.id === thisUserStoryData)?.storyArray.length - 1]?.fileURL})` : undefined,
			backgroundColor: fileUrl || viewStory  ? 'rgba(0, 0, 0, 1)' : undefined}}>
				<div className={s.content1}>
				<div className={s.block1} style={{width:`${width}%`}}></div>
				<div className={s.block2}>
				<span className={s.miniBlock}> 
					<img src={viewStory ?  users?.find(user=> user.id === thisUserStoryData)?.photo?.placed || users?.find(user=> user.id === thisUserStoryData)?.photo?.default  : thisUserIdStory?.photo} alt="" />
					<span className={s.item}>
						<span className={s.miniItem1}>{viewStory ? users?.find(user=> user.id === thisUserStoryData)?.username : "You"}</span>
						<span className={s.miniItem2}>{viewStory ? calculateTimeDifference(users?.find(user=> user.id === thisUserStoryData)?.storyArray[users?.find(user => user.id === thisUserStoryData)?.storyArray.length - 1]?.timeAdded) : ""}</span>
					</span>
				</span>
					<span onClick={()=>{
						setOpenStoryModal((prevOpenStoryModal)=>false)
						
						setTimeout(()=>{
							setViewStory((prevViewStory)=>false)
							localStorage.removeItem("storyData")
							localStorage.removeItem("thisUserStoryData")},150)
					}}><IoMdCloseCircle /></span>
				</div>
				</div>
				{viewStory
				? <div className={s.content4}>
				{thisUserStoryData === thisUser?.id 
				? <>
				{	users?.find(user=> user.id === thisUserStoryData)?.storyArray[users?.find(user => user.id === thisUserStoryData)?.storyArray.length - 1]?.storyText !== null &&
				<div className={s.miniBlock1}>
					{users?.find(user=> user.id === thisUserStoryData)?.storyArray[users?.find(user => user.id === thisUserStoryData)?.storyArray.length - 1]?.storyText}
				</div>}
				<div className={s.miniBlock2}>
					<span className={s.item1}> <IoEyeSharp /> {users?.find(user=> user.id === thisUserStoryData)?.storyArray[users?.find(user => user.id === thisUserStoryData)?.storyArray.length - 1]?.view?.length || 0} </span>
					<span className={s.item2} onClick={()=>{handlerDeleteStory(users?.find(user=> user.id === thisUserStoryData)?.storyArray[users?.find(user => user.id === thisUserStoryData)?.storyArray.length - 1]?.id,thisUser)}}><MdDelete /></span>
					</div>
					</>
					
				: <div className={s.miniBlock1}>
					{users?.find(user=> user.id === thisUserStoryData)?.storyArray[users?.find(user => user.id === thisUserStoryData)?.storyArray.length - 1]?.storyText}
				</div>}
				</div>
				: !fileUrl 
				? <div className={s.miniContent1}> 
					<div className={s.miniBlock1}>
						<textarea type="text" value={storyText} onChange={(e)=>{setStoryText(e.target.value)}} placeholder="Text..."></textarea>
					</div>
					<div className={s.miniBlock2}>
				<label htmlFor="addStory" className={s.content2}>Upload photo <FaPhotoFilm /></label>
					</div> 
					</div>
				: <div className={s.content3}>
					<div className={s.miniBlock1}>
						<textarea type="text" value={storyText} onChange={(e)=>{setStoryText(e.target.value)}} placeholder="Text..." ></textarea>
					</div>
					<div className={s.miniBlock2}>
					<button onClick={()=>{handlerAddStory(thisUser,fileUrl,storyText)}} className={s.item1}>Add story</button>
					<span className={s.item2} onClick={()=>{setFileUrl(null)}}><MdDelete /></span>
					</div>
				</div>}

			</div>
		</dialog>,document.getElementById('story')
		)
}

export default ModalStory