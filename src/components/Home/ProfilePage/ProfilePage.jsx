import s from './ProfilePage.module.scss'
import React,{ useState,useCallback,useEffect,useContext,useRef} from 'react'
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdOutlineAttachFile } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import { HiMiniPlusSmall } from "react-icons/hi2";
import { BsThreeDotsVertical , BsHighlights } from "react-icons/bs";
import {Link} from 'react-router-dom'
import {  collection, doc, setDoc, getDoc , updateDoc } from "firebase/firestore";
import { getStorage,ref, uploadBytes } from "firebase/storage";
import { MyContext } from './../../../context/Context';
import { RiSendPlaneFill,RiCloseLine } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import MiniLoader from './../../MiniLoader/MiniLoader'
import { MdEdit,MdDeleteForever,MdOutlineClose} from "react-icons/md";
import { IoCopySharp } from "react-icons/io5";
import { HiMiniLockClosed } from "react-icons/hi2";
import {firebaseConfig,db,storage,docId} from './../../../firebase'
import {useLikePostMutation,usePostsQuery,useDislikePostMutation,useAddCommentToPostMutation,useDeletePostMutation,useAddPostMutation,useDeleteComment,useAddHighlight,usePinPost} from './../../../hooks/queryesHooks'
import { useQueryClient,useQuery } from 'react-query';
import { AiOutlineRollback } from "react-icons/ai";
import { MdOutlineReply,MdCircle,MdBrightness1,MdDelete } from "react-icons/md";
import { FiLink } from "react-icons/fi";
import {parseTextWithLinks} from './../../../helper/linkFunction.js'
import { GoBookmarkFill } from "react-icons/go";
import { IoMdPhotos } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { RiUserAddFill } from "react-icons/ri";
import { TbUserSearch } from "react-icons/tb";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { FaUserTag } from "react-icons/fa6";
import { TbMusicPlus,TbMusicSearch,TbPin , TbPinnedOff } from "react-icons/tb";
import { FaCirclePlay  } from "react-icons/fa6";
import { FaPauseCircle } from "react-icons/fa";
import { IoIosMusicalNotes,IoIosAddCircle } from "react-icons/io";
import { FaHeart, FaHeartBroken , FaComment,FaVolumeDown ,FaVolumeMute,FaChevronCircleDown , FaChevronCircleUp  } from "react-icons/fa";
import {isWithin24Hours} from './../../../helper/timeAdded'
import { MdRestore } from "react-icons/md";
import Picker from 'emoji-picker-react';
import { LuSmilePlus } from "react-icons/lu";
import twemoji from 'twemoji';
import ReactPlayer from 'react-player'
import {InstagramEmbedLoader} from './../../../helper/instaPost'
import {TelegramEmbedLoader} from './../../../helper/telegramPost'






const ProfilePage = ()=>{

 const {   isWideScreen,logined ,calculateTimeDifference,commentText,setCommentText,copyToClipboard,setNotificText,t,setActiveLink,fileUrls, setFileUrls,zoomThisPhoto,srcMusicId,setSrcMusicId,setOpenStoryModal,setViewStory,isLoading,setIsLoading} = useContext(MyContext);

	const forwardPostStorage = JSON.parse(localStorage.getItem("forwardPost"))

	const queryClient = useQueryClient();
	const [postText,setPostText] = useState("")
	const [fileUrl, setFileUrl] = useState(null);
	const [showFile,setShowFile] = useState(false)
	const [openSettings,setOpenSettings] = useState(null)
	const [forwardPost,setForwardPost] = useState(forwardPostStorage ? forwardPostStorage : null)
	const [replyComment,setReplyComment] = useState(null)
	const [openUsers,setOpenUsers] = useState(false)
	const [openMusic,setOpenMusic] = useState(false)
	const [tagUser,setTagUser] = useState(null)
	const [trackId,setTrackId] = useState(null)
	const [play,setPlay] = useState({ musicId: null, postId: null, playMusic: false })
	const [storyHeight,setStoryHeight] = useState(false)
	const [hidden,setHidden] = useState()
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = ( emojiData , event) => {
  	 console.log('Emoji Data:', emojiData); 
    setPostText(prevText => prevText + emojiData.emoji);
  };

    const parseEmoji = (text) => {
    return twemoji.parse(text, {
      folder: 'svg',
      ext: '.svg'
    });
  };
 
	const likePostMutation = useLikePostMutation();
	const dislikePostMutation = useDislikePostMutation()
	const addCommentPostMutation = useAddCommentToPostMutation()
	const deletePostMutation = useDeletePostMutation()
	const addPostMutation = useAddPostMutation()
	const deleteCommentMutation = useDeleteComment()
	const addHighlightMutation = useAddHighlight();
	const pinPostMutation = usePinPost()


		const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
		const { data: thisUser } = useQuery('thisUser', () => queryClient.getQueryData('thisUser'));
		const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));
		const { data: musicsArray } = useQuery('musicsArray', () => queryClient.getQueryData('musicsArray'));

 const animBlock = useRef()
 const imageRef = useRef()
 const animTagUsers = useRef()
 const animMusics = useRef()

	 const postRef = useRef()
	

 let timer;

 useEffect (()=>{
	if(animBlock.current && logined){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }

 setActiveLink("/profile")

 return () => {
	setSrcMusicId((prevMusicId)=>null)
	if(animBlock.current && !logined){
	animBlock.current.classList.remove(s.animBlock)
	clearTimeout(timer)
 }
 }
 },[logined])

let timer2;

 useEffect (()=>{
	if(openUsers && animTagUsers.current){
 timer2 = setTimeout(()=>{
	animTagUsers.current.classList.add(s.active)
	animTagUsers.current.classList.remove(s.usersContainer)
 },10)

 } else if(!openUsers && animTagUsers.current){
	timer2 = setTimeout(()=>{
		animTagUsers.current.classList.add(s.usersContainer)
		animTagUsers.current.classList.remove(s.active)
	},10)
 }



 return () => {
	if(animTagUsers.current ){

	clearTimeout(timer2)
 }
 }
 },[openUsers])

 let timer3;

	useEffect (()=>{
	if(openMusic && animMusics.current){
 timer2 = setTimeout(()=>{
	animMusics.current.classList.add(s.activeMusic)
	animMusics.current.classList.remove(s.musicContainer)
 },10)

 } else if(!openMusic && animMusics.current){
	timer3 = setTimeout(()=>{
		animMusics.current.classList.add(s.musicContainer)
		animMusics.current.classList.remove(s.activeMusic)
	},10)
 }

 

 return () => {
	
	if(animMusics.current  ){
		clearTimeout(timer3)
 }
 }
 },[openMusic])

	 const handleFileChange = (e) => {
				if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			const url = URL.createObjectURL(file);
			setFileUrl(url);
			
		}
	};

	 const handleLikePost = async (postId, userId) => {
		try {
			await likePostMutation.mutate({ postId, userId });
			console.log("Лайк успешно добавлен/удален к посту.");
		} catch (error) {
			console.error("Ошибка при обновлении лайка к посту:", error);
		}
	};

	const handleDislikePost = async (postId,userId) => {
		try{
			await dislikePostMutation.mutate({postId,userId})
			console.log("Дизлайк успешно добален к посту")
		}catch(error){
			console.log("Ошибка при обновления дизлайка к посту")
		}
	}

	const addCommentToPost = async (postId,userId,thisUser,commentText,replyComment,file) => {
		try{
			
			await addCommentPostMutation.mutate({postId,userId,thisUser,commentText,replyComment,file})
			setCommentText("")
			setNotificText(t('NotificComment'))
			setReplyComment(null)
		
		}catch (error) {
			console.error("Ошибка при добовления комментари")
		}
	}

	const handleDeleteItem = async (idToDelete) => {
		try{
			await deletePostMutation.mutate({idToDelete})
			setNotificText(t('NotificPostDel'))
		}catch (error) {
			console.error("Ошибка при удаления поста")
		}
	}

	const handleAddPost = async (thisUser,postText,fileUrl,imageRef,forwardPost,tagged,trackId) => {
		try{
			if(postText !== "" || fileUrl !== null || forwardPost !== null){
			await addPostMutation.mutate({thisUser,postText,fileUrl,imageRef,forwardPost,tagged,trackId})
			setPostText("")
			setFileUrl("")
			setForwardPost(null)
			setTagUser(null)
			setNotificText(t('NotificPostAdd'))
			setTrackId(null)
			localStorage.removeItem("forwardPost")
		} else {
			setNotificText(t('Error'))
		}
		}catch (error) {
			console.error("Ошибка при добовления поста")
		}
	}

	const handleDeleteComment = async (postId,commentIdToDelete) => {
		try{

		await deleteCommentMutation.mutate({postId,commentIdToDelete})
			setNotificText(t('NotificComtDel'))

		}catch (error){
			console.error("Ошибка при удаления комментари",error)
		}
	}


	const handlePinPost = async (postIdToPin,thisUser) => {
		try{

		await pinPostMutation.mutate({postIdToPin,thisUser})
			setNotificText("This post pinned")

		}catch (error){
			console.error("Ошибка ",error)
		}
	}	

const playMusic = (musicId,postId,musicSrc) => {
	setSrcMusicId((prevMusicId)=>null)
	setTimeout(()=>{setSrcMusicId((prevMusicId)=>musicSrc)},10)
		setPlay((prevPlay) => ({
				...prevPlay,
				musicId: musicId,
				postId:postId,
				playMusic: true
		}));
		

};


const pauseMusic = (musicId,postId) => {
	setSrcMusicId((prevMusicId)=>null)
		setPlay((prevPlay) => ({
				...prevPlay,
				musicId: musicId,
				postId:postId,
				playMusic: false
		}));
		
 
};

	 const handleAddHighlight = async (userId, storyId) => {
		try {
			await addHighlightMutation.mutate({ userId, storyId });
			console.log("Лайк успешно добавлен/удален к посту.");
			setNotificText("Removed from Highlights")
		} catch (error) {
			console.error("Ошибка при обновлении лайка к посту:", error);
		}
	};


		 const handleCommentChange = useCallback((postId, text) => {
		setCommentText(prevState => ({
			...prevState,
			[postId]: text
		}));
	}, []);


		 const handleReplyComment = useCallback((postId, comment) => {
		localStorage.setItem("thisComment", JSON.stringify(comment));
		setReplyComment({ ...replyComment, [postId]: comment });
	}, []);


const handleFileChangeComment = useCallback((e, postId) => {
 
	if (e.target.files && e.target.files.length > 0) {
 
		const thisFile = e.target.files[0];
		const url = URL.createObjectURL(thisFile);

		setFileUrls(prevFileUrls => ({
			...prevFileUrls,
			[postId]: {url:url,file:thisFile}

		}));
	}

}, []);





	useEffect(()=>{
		if(fileUrl){
			setShowFile(true)
		} else {
			setShowFile(false)

		}
	},[fileUrl])


const replyCommentRef = useRef()

 useEffect(()=>{
	
if(replyComment !== null && replyCommentRef.current){

replyCommentRef.current.classList.add(s.replyCommentAnim) 
} else if(replyComment === null && replyCommentRef.current){
	replyCommentRef.current.classList.remove(s.replyCommentAnim)

}

 },[replyComment])


	const postThisUser = arrayPosts 
	? arrayPosts
	.filter(m => m.userId === thisUser?.id && m.pinned !== true) 
		.map(m => 		<div className={s.postMegaContent} ref={postRef} key={m.id} >

					<div className={s.postMiniContent1}>
						<span className={s.postBlock1}>
							<img src={thisUser?.photo?.placed ? thisUser?.photo?.placed : thisUser?.photo?.default} alt="" 
							className={users?.find(user=> user.id === thisUser?.id)?.storyArray?.some(story => isWithin24Hours(story?.timeAdded)) ? users?.find(user=> user.id === thisUser?.id)?.storyArray[users?.find(user => user.id === thisUser?.id)?.storyArray.length - 1]?.view?.includes(thisUser?.id) ? s.viewedstory : s.activeStory : ""}/>
							<span>{thisUser.onlineStatus  ? <MdCircle title="Online" size="11" color="limegreen"/> : <MdBrightness1 title="Offline" size="11" color="rgba(256,256,256,0.8)"/>}</span>
						</span>
						<span className={s.postBlock2}>
							{thisUser?.username}
						</span>
						<span className={s.postBlock3}>
							{calculateTimeDifference(m.timeAdded)}
						</span>
						<span className={s.postBlock4}>
							{m.postChanged ?  `( ${t('Changed')} )` : ""}
						</span>
						<span className={s.postSettings} onMouseLeave={()=>{setOpenSettings(null)}}>
						<span onClick={()=>{ setOpenSettings(m.id) }} className={s.item1}><BsThreeDotsVertical /></span>
						{openSettings === m.id 
						? <span className={s.item2} >
							<Link to={`/home/profile/edit/post/${m.id}`} className={s.miniItem1}><MdEdit/><span>{t("Edit")}</span></Link>
							<span className={s.miniItem2} onClick={()=>{
								copyToClipboard(`https://cospulse.netlify.app/home/comment/post/${m.id}`)
								setOpenSettings(null)
								
							}}><IoCopySharp/>{t("CopyLink")}</span>
							{/* <span className={s.miniItem4} onClick={()=>{ */}
							{/* 	handlePinPost(m.id,thisUser) */}
							{/* }}><TbPin/>Pin</span> */}
							<span className={s.miniItem3} onClick={()=>{
								handleDeleteItem(m.id)
								

							}}><MdDeleteForever/><span>{t("Delete")}</span></span>
						</span> 
						: "" }
					</span>
					</div>
					<div className={s.postMiniContent2}>
						{m.forwardPost !== undefined &&  m.forwardPost !== "" 
					
					
				? arrayPosts?.find(post => post.id === m.forwardPost.fwPostid) 
				? <Link className={s.fwPost} to={`/home/comment/post/${m.forwardPost.fwPostid}`}>
					<span className={s.fwItem1}>
					<span className={s.miniFwitem1}>
					{t("Forward")}
					</span>
					<Link to={`/home/user/profile/${arrayPosts?.find(post => post.id === m.forwardPost.fwPostid)?.userId ? arrayPosts?.find(post => post.id === m.forwardPost.fwPostid)?.userId : ""}`} className={s.miniFwitem2}>
					{m.forwardPost?.fwPostUser}
					</Link>

					</span>
					{m.forwardPost?.fwPostImage 
					? <span className={s.fwItem2}>
					<img src={m.forwardPost?.fwPostImage} alt="" /> 
					</span> 
					: ""}
					{m.forwardPost?.fwPosttext 
					? <span className={s.fwItem3}>
						{m.forwardPost?.fwPosttext }
						</span> 
					: "" }
				</Link>
				: <div className={s.deletedPost}>{t('ThisPostDeleted')}</div>
				: "" }
						{m.imageURL 
						? <span className={s.item1}><img src={m.imageURL ? m.imageURL : <MiniLoader />} alt="" /></span>
						: "" }
						{m.videoURL
						? <span className={s.videoItem} >
							
						<video controls playsInline allowfullscreen="false"  >
          	<source src={m.videoURL}  type="video/mp4" />
          
        		</video>
        		</span>
        		: ""}
						{m.postText 
						? <span className={s.item2}>
						<InstagramEmbedLoader/>
						<TelegramEmbedLoader/>
						{parseTextWithLinks(m.postText)}
						</span>
						: "" }
						{m.taggedUser !== undefined && m.taggedUser !== null 
						? <Link to={`/home/user/profile/${users?.find(user=> user.id === m.taggedUser).id}`} className={s.taggedUserContainer}>
							
							<FaUserTag /> 
							@{users?.find(user=> user.id === m.taggedUser).username}
							
							</Link>
							: ""}
					{m.trackId !== null && m.trackId !== undefined 
					? <div className={s.musicContent} >
					<span className={s.musicItem1}><IoIosMusicalNotes />{musicsArray?.find(music => music.id === m.trackId)?.trackName?.length > 35 ? `${musicsArray?.find(music => music.id === m.trackId)?.trackName?.slice(0,35)}...` : musicsArray?.find(music => music.id === m.trackId)?.trackName}</span>
					<span className={s.musicItem2}>		
					{play?.musicId === musicsArray?.find(music => music.id === m.trackId)?.id && play?.playMusic === true && play?.postId === m.id
		? <span onClick={()=>{pauseMusic(musicsArray?.find(music => music.id === m.trackId).id,m.id)}}><FaPauseCircle /> </span>
		: <span onClick={()=>{playMusic(musicsArray?.find(music => music.id === m.trackId).id,m.id,musicsArray?.find(music => music.id === m.trackId).urlTrack)}}><FaCirclePlay /> </span> }</span>
					</div>
					: ""}
					</div>
					<div className={s.postMiniContent3}>
						{m.likes.includes(thisUser?.id) 
						? <span onClick={()=>{handleLikePost(m.id,thisUser?.id)}}>
						<FaHeart title="Like" color="whitesmoke"/>
						{Array.isArray(m.likes) ? m.likes.length : 0}
						</span>
						:<span onClick={()=>{handleLikePost(m.id,thisUser?.id)}}>
						<FaHeart title="Like" />
						{Array.isArray(m.likes) ? m.likes.length : 0}
						</span> 
						}
						{m.dislikes.includes(thisUser?.id) 
						?  <span onClick={()=>{handleDislikePost(m.id,thisUser?.id)}}>
						<FaHeartBroken title="Dislike" color="whitesmoke"/>
						{Array.isArray(m.dislikes) ? m.dislikes.length : 0}
						</span> 
						: <span onClick={()=>{handleDislikePost(m.id,thisUser?.id)}}>
						<FaHeartBroken title="Dislike"/>
						{Array.isArray(m.dislikes) ? m.dislikes.length : 0}
						</span> 
						}
						{!m.privateComment 
						?<Link to={`/home/comment/post/${m.id}`}>
							<span><FaComment title="Comments"/>{m.commentArray.length}</span>
						</Link>
						:
							<span><FaComment title="Comments"/><HiMiniLockClosed color="#888" size="15"/></span>
						 }
					</div>
					<div className={s.postMiniContent4}>
						{!m.privateComment 
						? <div className={s.postCommentBlock1}>
							{m.commentArray.length !== 0
							?  m.commentArray.map(comment => (
									<div key={comment.id} className={s.Comment}>
										<div className={s.Block1}>
											<span className={s.item}>
											 <Link to={thisUser?.id !== comment.userId ? `/home/user/profile/${comment.userId}` : "/home/profile"} >
											 <img src={users?.find(user => user.id === comment.userId).photo?.placed  || users?.find(user => user?.id === comment.userId).photo?.default } alt="" 
											  className={users?.find(user=> user.id === comment.userId)?.storyArray?.some(story => isWithin24Hours(story?.timeAdded)) ? users?.find(user=> user.id === comment.userId)?.storyArray[users?.find(user => user.id === comment.userId)?.storyArray.length - 1]?.view?.includes(thisUser?.id) ? s.viewedstory : s.activeStory : ""}   /></Link>
											 <span>
													{
														comment.userId === thisUser?.id
														? (
															thisUser?.onlineStatus
															? <MdCircle title="Online" size="11" color="limegreen"/>
															: <MdBrightness1 title="Offline" size="11" color="rgba(256,256,256,0.8)"/>
														)
														: (
															users?.filter(user => user.id !== thisUser?.id)?.find(user => user.id === comment.userId)?.onlineStatus
															? <MdCircle title="Online" size="11" color="limegreen"/>
															: <MdBrightness1 title="Offline" size="11" color="rgba(256,256,256,0.8)"/>
														)
													}
											 </span>
											</span>
										</div>
										<div className={s.Block2}>
											<span className={s.item1}>
												<span className={s.miniItem1}>{users?.find(user => user.id === comment.userId).username || "Deleted"}</span>
												<span className={s.miniItem2}>{calculateTimeDifference(comment.timeAdded)}</span>

											</span>
											<span className={s.item2}>
											{comment.replyComment !== undefined &&  comment.replyComment !== ""
												?	<div className={s.miniItem1}>
													<span className={s.miniBlock1}>
														{users?.find(user => user.id === comment.replyComment.userId).username || ""}
													</span>
													<span className={s.miniBlock2}>
														{comment.replyComment.commentText}
													</span>
												</div>
												: "" }
												{comment.imgUrl !== undefined && comment.imgUrl !== "" ? 
												<div className={s.miniItem}>
													<img src={comment.imgUrl} alt="" width="100px"/>
												</div>
												: ""}
												<div className={s.miniItem2}>
												{comment.commentText}
												</div>
											</span>
										</div>
									 <div className={s.Block3} >
										<button onClick={()=>{ handleReplyComment(m.id,comment)}}><MdOutlineReply title="reply" /></button>
										<button onClick={()=>{handleDeleteComment(m.id,comment.id)}}>	<MdDelete title="delete"/> </button>
										</div>
									 </div>
								))
							.slice(m.commentArray.length - 2,m.commentArray.length )
							: <div className={s.noComment}>
								{t('NоComments')}
							</div>}
						</div>
						: <div className={s.privateComment}>
								<div className={s.item}>{t("ClosedComment")}<HiMiniLockClosed color="#999" size="52"/></div>
							</div> }

							{replyComment !== null && replyComment[m.id] ? 
							<div className={s.replyContainer} ref={replyCommentRef}>
							<div className={s.replyMegaContent1}>
							<div className={s.replyContent1}>
								{t('inReply')} {users?.find(user => user.id === replyComment[m.id]?.userId).username}
							</div>
							<div className={s.replyContent2} onClick={()=>{
								localStorage.removeItem("thisComment")
								setReplyComment(null)
							}}>
								<MdOutlineClose />
							</div>
							</div>
							<div className={s.replyMegaContent2}>
								{replyComment[m.id]?.commentText}
							</div>
							</div>
							:"" }
							{fileUrls[m.id]?.url &&
							<div className={s.imgContainer}>
							 <img src={fileUrls[m.id]?.url} alt="Preview" width="100px" /> 
							 <span onClick={() => {
								 setFileUrls(prevFileUrls => {
									 const updatedFileUrl = { ...prevFileUrls };
									 delete updatedFileUrl[m.id];
									 return updatedFileUrl;
									});
								}}>
							 <MdOutlineClose />
							 </span>
							 </div>
							 }

						<div className={s.postCommentBlock2}>
							<span className={s.postCommentItem1}><img title={thisUser?.username} src={thisUser?.photo?.placed ? thisUser?.photo?.placed  : thisUser?.photo?.default } alt="" /></span>
							<span className={s.postCommentItem2}>
							{!m.privateComment 
							? <textarea value={commentText[m.id] || ""} onChange={(e)=>{handleCommentChange(m.id,e.target.value)}} type="text" placeholder={t('AddComment')}/>
							: <textarea value={commentText[m.id] || ""}  disabled="true" onChange={(e)=>{handleCommentChange(m.id,e.target.value)}} type="text" placeholder="..."/>}
							</span>
							{!m.privateComment 
							? <span className={s.postCommentItem3}>
							<input  id={`fileUrl-${[m.id]}`} type="file" onChange={(e)=>{handleFileChangeComment(e,m.id)}}  />
							<label htmlFor={`fileUrl-${[m.id]}`} className={s.item1}><IoMdPhotos/></label>
							<span  onClick={()=>{
								addCommentToPost(m.id,thisUser?.id,thisUser,commentText[m.id],replyComment,fileUrls[m.id]?.file)
								 setFileUrls(prevFileUrls => {
									 const updatedFileUrl = { ...prevFileUrls };
									 delete updatedFileUrl[m.id];
									 return updatedFileUrl;
									});
							}} className={s.item2}><RiSendPlaneFill title="Send"/></span>
							</span>
							: <span className={s.postCommentItem3}  style={{opacity:"0.5"}}>
							<span className={s.item1}><IoMdPhotos/></span>
							<span className={s.item2}><RiSendPlaneFill  title="Send"/></span>
							</span> 
							}	
						</div>

					</div>

				</div>)

	: <MiniLoader />


// 	const pinnedPost = arrayPosts
// 	? arrayPosts
// 	.filter(m=> m.pinned === true)
// 		.map(m => 		<div className={s.postMegaContent} ref={postRef} key={m.id} >
// 
// 					<div className={s.postMiniContent1}>
// 						<span className={s.postBlock1}>
// 							<img src={thisUser?.photo?.placed ? thisUser?.photo?.placed : thisUser?.photo?.default} alt="" 
// 							className={users?.find(user=> user.id === thisUser?.id)?.storyArray?.some(story => isWithin24Hours(story?.timeAdded)) ? users?.find(user=> user.id === thisUser?.id)?.storyArray[users?.find(user => user.id === thisUser?.id)?.storyArray.length - 1]?.view?.includes(thisUser?.id) ? s.viewedstory : s.activeStory : ""}/>
// 							<span>{thisUser.onlineStatus  ? <MdCircle title="Online" size="11" color="limegreen"/> : <MdBrightness1 title="Offline" size="11" color="rgba(256,256,256,0.8)"/>}</span>
// 						</span>
// 						<span className={s.postBlock2}>
// 							{thisUser?.username}
// 						</span>
// 						<span className={s.postBlock3}>
// 							{calculateTimeDifference(m.timeAdded)}
// 						</span>
// 						<span className={s.postBlock4}>
// 							{m.postChanged ?  `( ${t('Changed')} )` : ""}
// 						</span>
// 						<span className={s.postBlock5}>
// 							<TbPin />
// 						</span>
// 						<span className={s.postSettings} onMouseLeave={()=>{setOpenSettings(null)}}>
// 						<span onClick={()=>{ setOpenSettings(m.id) }} className={s.item1}><BsThreeDotsVertical /></span>
// 						{openSettings === m.id 
// 						? <span className={s.item2} >
// 							<Link to={`/home/profile/edit/post/${m.id}`} className={s.miniItem1}><MdEdit/><span>{t("Edit")}</span></Link>
// 							<span className={s.miniItem2} onClick={()=>{
// 								copyToClipboard(`https://cospulse.netlify.app/home/comment/post/${m.id}`)
// 								setOpenSettings(null)
// 								
// 							}}><IoCopySharp/>{t("CopyLink")}</span>
// 							{/* <span className={s.miniItem4} onClick={()=>{ */}
// 							{/* 	handlePinPost(m.id,thisUser) */}
// 							{/* 	setOpenSettings(null) */}
// 							{/* }}><TbPin/>Pin</span> */}
// 							<span className={s.miniItem3} onClick={()=>{
// 								handleDeleteItem(m.id)
// 								
// 
// 							}}><MdDeleteForever/><span>{t("Delete")}</span></span>
// 						</span> 
// 						: "" }
// 					</span>
// 					</div>
// 					<div className={s.postMiniContent2}>
// 					{m.trackId !== null && m.trackId !== undefined 
// 					? <div className={s.musicContent} >
// 					<span className={s.musicItem1}><IoIosMusicalNotes />{musicsArray?.find(music => music.id === m.trackId)?.trackName?.length > 35 ? `${musicsArray?.find(music => music.id === m.trackId)?.trackName?.slice(0,35)}...` : musicsArray?.find(music => music.id === m.trackId)?.trackName}</span>
// 					<span className={s.musicItem2}>		
// 					{play?.musicId === musicsArray?.find(music => music.id === m.trackId)?.id && play?.playMusic === true && play?.postId === m.id
// 		? <span onClick={()=>{pauseMusic(musicsArray?.find(music => music.id === m.trackId).id,m.id)}}><FaPauseCircle /> </span>
// 		: <span onClick={()=>{playMusic(musicsArray?.find(music => music.id === m.trackId).id,m.id,musicsArray?.find(music => music.id === m.trackId).urlTrack)}}><FaCirclePlay /> </span> }</span>
// 					</div>
// 					: ""}
// 						{m.forwardPost !== undefined &&  m.forwardPost !== "" 
// 					
// 					
// 				? arrayPosts?.find(post => post.id === m.forwardPost.fwPostid) 
// 				? <Link className={s.fwPost} to={`/home/comment/post/${m.forwardPost.fwPostid}`}>
// 					<span className={s.fwItem1}>
// 					<span className={s.miniFwitem1}>
// 					{t("Forward")}
// 					</span>
// 					<Link to={`/home/user/profile/${arrayPosts?.find(post => post.id === m.forwardPost.fwPostid)?.userId ? arrayPosts?.find(post => post.id === m.forwardPost.fwPostid)?.userId : ""}`} className={s.miniFwitem2}>
// 					{m.forwardPost?.fwPostUser}
// 					</Link>
// 
// 					</span>
// 					{m.forwardPost?.fwPostImage 
// 					? <span className={s.fwItem2}>
// 					<img src={m.forwardPost?.fwPostImage} alt="" /> 
// 					</span> 
// 					: ""}
// 					{m.forwardPost?.fwPosttext 
// 					? <span className={s.fwItem3}>
// 						{m.forwardPost?.fwPosttext }
// 						</span> 
// 					: "" }
// 				</Link>
// 				: <div className={s.deletedPost}>{t('ThisPostDeleted')}</div>
// 				: "" }
// 						{m.imageURL 
// 						? <span className={s.item1}><img src={m.imageURL ? m.imageURL : <MiniLoader />} alt="" /></span>
// 						: "" }
// 						{m.postText 
// 						? <span className={s.item2}>
// 						{parseTextWithLinks(m.postText)}
// 						</span>
// 						: "" }
// 						{m.taggedUser !== undefined && m.taggedUser !== null 
// 						? <Link to={`/home/user/profile/${users?.find(user=> user.id === m.taggedUser).id}`} className={s.taggedUserContainer}>
// 							
// 							<FaUserTag /> 
// 							@{users?.find(user=> user.id === m.taggedUser).username}
// 							
// 							</Link>
// 							: ""}
// 					</div>
// 					<div className={s.postMiniContent3}>
// 						{m.likes.includes(thisUser?.id) 
// 						? <span onClick={()=>{handleLikePost(m.id,thisUser?.id)}}>
// 						<FaHeart title="Like" color="whitesmoke"/>
// 						{Array.isArray(m.likes) ? m.likes.length : 0}
// 						</span>
// 						:<span onClick={()=>{handleLikePost(m.id,thisUser?.id)}}>
// 						<FaHeart title="Like" />
// 						{Array.isArray(m.likes) ? m.likes.length : 0}
// 						</span> 
// 						}
// 						{m.dislikes.includes(thisUser?.id) 
// 						?  <span onClick={()=>{handleDislikePost(m.id,thisUser?.id)}}>
// 						<FaHeartBroken title="Dislike" color="whitesmoke"/>
// 						{Array.isArray(m.dislikes) ? m.dislikes.length : 0}
// 						</span> 
// 						: <span onClick={()=>{handleDislikePost(m.id,thisUser?.id)}}>
// 						<FaHeartBroken title="Dislike"/>
// 						{Array.isArray(m.dislikes) ? m.dislikes.length : 0}
// 						</span> 
// 						}
// 						{!m.privateComment 
// 						?<Link to={`/home/comment/post/${m.id}`}>
// 							<span><FaComment title="Comments"/>{m.commentArray.length}</span>
// 						</Link>
// 						:
// 							<span><FaComment title="Comments"/><HiMiniLockClosed color="#888" size="15"/></span>
// 						 }
// 					</div>
// 					<div className={s.postMiniContent4}>
// 						{!m.privateComment 
// 						? <div className={s.postCommentBlock1}>
// 							{m.commentArray.length !== 0
// 							?  m.commentArray.map(comment => (
// 									<div key={comment.id} className={s.Comment}>
// 										<div className={s.Block1}>
// 											<span className={s.item}>
// 											 <Link to={thisUser?.id !== comment.userId ? `/home/user/profile/${comment.userId}` : "/home/profile"} >
// 											 <img src={users?.find(user => user.id === comment.userId).photo?.placed  || users?.find(user => user?.id === comment.userId).photo?.default } alt="" 
// 											  className={users?.find(user=> user.id === comment.userId)?.storyArray?.some(story => isWithin24Hours(story?.timeAdded)) ? users?.find(user=> user.id === comment.userId)?.storyArray[users?.find(user => user.id === comment.userId)?.storyArray.length - 1]?.view?.includes(thisUser?.id) ? s.viewedstory : s.activeStory : ""}   /></Link>
// 											 <span>
// 													{
// 														comment.userId === thisUser?.id
// 														? (
// 															thisUser?.onlineStatus
// 															? <MdCircle title="Online" size="11" color="limegreen"/>
// 															: <MdBrightness1 title="Offline" size="11" color="rgba(256,256,256,0.8)"/>
// 														)
// 														: (
// 															users?.filter(user => user.id !== thisUser?.id)?.find(user => user.id === comment.userId)?.onlineStatus
// 															? <MdCircle title="Online" size="11" color="limegreen"/>
// 															: <MdBrightness1 title="Offline" size="11" color="rgba(256,256,256,0.8)"/>
// 														)
// 													}
// 											 </span>
// 											</span>
// 										</div>
// 										<div className={s.Block2}>
// 											<span className={s.item1}>
// 												<span className={s.miniItem1}>{users?.find(user => user.id === comment.userId).username || "Deleted"}</span>
// 												<span className={s.miniItem2}>{calculateTimeDifference(comment.timeAdded)}</span>
// 
// 											</span>
// 											<span className={s.item2}>
// 											{comment.replyComment !== undefined &&  comment.replyComment !== ""
// 												?	<div className={s.miniItem1}>
// 													<span className={s.miniBlock1}>
// 														{users?.find(user => user.id === comment.replyComment.userId).username || ""}
// 													</span>
// 													<span className={s.miniBlock2}>
// 														{comment.replyComment.commentText}
// 													</span>
// 												</div>
// 												: "" }
// 												{comment.imgUrl !== undefined && comment.imgUrl !== "" ? 
// 												<div className={s.miniItem}>
// 													<img src={comment.imgUrl} alt="" width="100px"/>
// 												</div>
// 												: ""}
// 												<div className={s.miniItem2}>
// 												{comment.commentText}
// 												</div>
// 											</span>
// 										</div>
// 									 <div className={s.Block3} >
// 										<button onClick={()=>{ handleReplyComment(m.id,comment)}}><MdOutlineReply title="reply" /></button>
// 										<button onClick={()=>{handleDeleteComment(m.id,comment.id)}}>	<MdDelete title="delete"/> </button>
// 										</div>
// 									 </div>
// 								))
// 							.slice(m.commentArray.length - 2,m.commentArray.length )
// 							: <div className={s.noComment}>
// 								{t('NоComments')}
// 							</div>}
// 						</div>
// 						: <div className={s.privateComment}>
// 								<div className={s.item}>{t("ClosedComment")}<HiMiniLockClosed color="#999" size="52"/></div>
// 							</div> }
// 
// 							{replyComment !== null && replyComment[m.id] ? 
// 							<div className={s.replyContainer} ref={replyCommentRef}>
// 							<div className={s.replyMegaContent1}>
// 							<div className={s.replyContent1}>
// 								{t('inReply')} {users?.find(user => user.id === replyComment[m.id]?.userId).username}
// 							</div>
// 							<div className={s.replyContent2} onClick={()=>{
// 								localStorage.removeItem("thisComment")
// 								setReplyComment(null)
// 							}}>
// 								<MdOutlineClose />
// 							</div>
// 							</div>
// 							<div className={s.replyMegaContent2}>
// 								{replyComment[m.id]?.commentText}
// 							</div>
// 							</div>
// 							:"" }
// 							{fileUrls[m.id]?.url &&
// 							<div className={s.imgContainer}>
// 							 <img src={fileUrls[m.id]?.url} alt="Preview" width="100px" /> 
// 							 <span onClick={() => {
// 								 setFileUrls(prevFileUrls => {
// 									 const updatedFileUrl = { ...prevFileUrls };
// 									 delete updatedFileUrl[m.id];
// 									 return updatedFileUrl;
// 									});
// 								}}>
// 							 <MdOutlineClose />
// 							 </span>
// 							 </div>
// 							 }
// 
// 						<div className={s.postCommentBlock2}>
// 							<span className={s.postCommentItem1}><img title={thisUser?.username} src={thisUser?.photo?.placed ? thisUser?.photo?.placed  : thisUser?.photo?.default } alt="" /></span>
// 							<span className={s.postCommentItem2}>
// 							{!m.privateComment 
// 							? <textarea value={commentText[m.id] || ""} onChange={(e)=>{handleCommentChange(m.id,e.target.value)}} type="text" placeholder={t('AddComment')}/>
// 							: <textarea value={commentText[m.id] || ""}  disabled="true" onChange={(e)=>{handleCommentChange(m.id,e.target.value)}} type="text" placeholder="..."/>}
// 							</span>
// 							{!m.privateComment 
// 							? <span className={s.postCommentItem3}>
// 							<input  id={`fileUrl-${[m.id]}`} type="file" onChange={(e)=>{handleFileChangeComment(e,m.id)}}  />
// 							<label htmlFor={`fileUrl-${[m.id]}`} className={s.item1}><IoMdPhotos/></label>
// 							<span  onClick={()=>{
// 								addCommentToPost(m.id,thisUser?.id,thisUser,commentText[m.id],replyComment,fileUrls[m.id]?.file)
// 								 setFileUrls(prevFileUrls => {
// 									 const updatedFileUrl = { ...prevFileUrls };
// 									 delete updatedFileUrl[m.id];
// 									 return updatedFileUrl;
// 									});
// 							}} className={s.item2}><RiSendPlaneFill title="Send"/></span>
// 							</span>
// 							: <span className={s.postCommentItem3}  style={{opacity:"0.5"}}>
// 							<span className={s.item1}><IoMdPhotos/></span>
// 							<span className={s.item2}><RiSendPlaneFill  title="Send"/></span>
// 							</span> 
// 							}	
// 						</div>
// 
// 					</div>
// 
// 				</div>)
// : ""

	return (
		logined
		? <div className={s.megaContainer} ref={animBlock}>

			<div className={s.content1} >
			<div className={s.megaBlock}>
			<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button>
			<span>
			<Link to="/home/archive"><MdRestore title="Archive"/></Link>
			<Link to="/home/save"><GoBookmarkFill title="Save"/></Link> 
			<Link  to="/home/settings"><IoSettingsSharp title="Edit profile"/></Link>
			</span>
			</div>
				<span className={s.Block1}>
				<span className={s.miniBlock3}>
				<span className={s.miniBlock}>{thisUser?.description || "..."}</span>
					</span>
				<span className={s.miniBlock1}>
				<img onClick={
					()=>(thisUser?.storyArray?.some(story => isWithin24Hours(story.timeAdded))
					? (setOpenStoryModal(true), 
						setViewStory(true) , 
						localStorage.setItem("thisUserStoryData",JSON.stringify(thisUser?.id)))
					:zoomThisPhoto(thisUser?.photo?.placed ? thisUser?.photo?.placed : thisUser?.photo?.default))
				} src={thisUser?.photo?.placed ? thisUser?.photo?.placed : thisUser?.photo?.default} alt="" 
				className={thisUser?.storyArray?.some(story => isWithin24Hours(story?.timeAdded)) ? s.activeStory : ""} />
				{!thisUser?.storyArray?.some(story => isWithin24Hours(story.timeAdded))
					? <span onClick={()=>{
					setOpenStoryModal((prevStoryModal)=>true)
					localStorage.setItem("storyData",JSON.stringify({
						id:thisUser?.id,
						photo:thisUser?.photo?.placed || thisUser?.photo?.default}))

				}}><IoIosAddCircle title="Add Story"/></span> : ""}
				</span>
				<span className={s.miniBlock2}>
					{thisUser ? 
					!thisUser.premiumUser 
					? thisUser.username 
					: <span>{thisUser.username}<FaStar/></span>
					: <MiniLoader/>}
				</span>
				{/* <span className={s.miniBlock}>{thisUser ? thisUser.description : ""}</span> */}
				</span>
				<span className={s.Block2}>
				<span className={s.miniBlock4}>
					<Link to="followers" className={s.btn1}>
					<span className={s.item1}>{thisUser ? thisUser?.userData?.followers?.length : 0}</span>
					<span>{t("Followers")}</span>
					</Link>
					<Link to="following" className={s.btn2}>
					<span className={s.item1}>{thisUser ? thisUser?.userData?.following?.length : 0}</span>
					<span>{t('Following')}</span>
					</Link>
				</span>
				{/* <span className={s.miniBlock3}> */}
				{/* <span className={s.miniBlock}>{thisUser?.description || "..."}</span> */}
				{/* 	</span> */}
				{thisUser?.link && thisUser?.link !== ""
				? <span className={s.miniBlock5}>
					<span><FiLink /></span>
					<a href={thisUser?.link} target="_blank">{thisUser?.link}</a> 
				</span>
				: ""}
					{thisUser ? 
					<span className={s.miniBlock1}>
					<span className={s.infoContent}>
					<span>{t("Age")}:<span className={s.item}> {thisUser?.age}</span></span> 
					<span>{t("Country")}:<span className={s.item}> {thisUser?.country ? thisUser.country : t('NotIndicated')}</span></span> 
					<span>{t("City")}: <span className={s.item}> {thisUser?.city ? thisUser.city : t('NotIndicated')}</span></span> 
					</span>
					<span className={s.statusContent}>
						<span className={s.onlineStatus}>
					{t('Online')} <MdCircle />
					</span>
					{/* <span className={s.offlineStatus}> */}
					{/* Offline <MdOutlineCircle /> */}
					{/* </span> */}
					</span>
					</span>
					: ""}
				</span>
			</div>
			<div className={s.content2}>
				<span className={s.miniBlock3}>{t("AddPost")}
				{tagUser !== null 
				?	<div className={s.taggedUserContainer}>
				<span className={s.item1}>
				<FaUserTag /> 
				{users?.find(user=> user.id === tagUser).username}

				</span>

				<span className={s.item2} onClick={()=>{setTagUser(null)}}>
				<MdOutlineClose />
				</span>
				</div>
				: ""}
				{trackId !== null
				? <div className={s.musicCont}>
				<span className={s.item1}>
				<IoIosMusicalNotes />
				{musicsArray?.find(music => music.id === trackId)?.trackName?.length > 35 ? `${musicsArray?.find(music => music.id === trackId)?.trackName?.slice(0,35)}...` : musicsArray?.find(music => music.id === trackId)?.trackName}
				</span> 
				<span className={s.item2} onClick={()=>{setTrackId(null)}}>
				<MdOutlineClose />
				</span>
				</div>
				: ""}
				</span>
				{forwardPost !== null 
				?<span className={s.fwPost}>
					<span className={s.item1}>
					<span>{t('Forward')} {forwardPost.fwPostUser}</span>
					<span onClick={()=>{
						setForwardPost(null)
						localStorage.removeItem("forwardPost")
					}}><MdOutlineClose /></span>
					</span>
					{forwardPost.fwPostImage 
					? <span className={s.item2}>
					<img src={forwardPost.fwPostImage} alt="" /> 
					</span> 
					: ""}
					{forwardPost.fwPosttext 
					? <span className={s.item3}>
						{forwardPost.fwPosttext }
						</span> 
					: "" }
				</span>
				: "" }
				<span className={s.miniBlock4}>
					<textarea value={postText} onChange={(e)=>{setPostText(e.target.value)}} name="postText" id=""></textarea>
				</span>
				<span className={s.miniBlock5}>
					<span className={s.block1}>
					{showFile  
					? <span className={s.item1} style={{backgroundImage: `url(${fileUrl})`}}>
							<span onClick={()=>{setFileUrl("")}}><RiCloseLine /></span>
						</span>
					:""}
					<span className={s.item2}>
					<input ref={imageRef} id="file" type="file"  style={{display:"none"}} onChange={handleFileChange}/>
						<label htmlFor="file" >
						<MdOutlineAddPhotoAlternate title="Photo" />
						</label>
						<span onClick={()=>{
							setOpenMusic((prevOpenMusic)=> !prevOpenMusic)
							setOpenUsers(false)
						}}>
						<TbMusicPlus  title="Music" />
						</span>
						<span onClick={()=>{
							setOpenUsers((prevOpenUsers)=> !prevOpenUsers)
							setOpenMusic(false)
						}}><RiUserAddFill /></span>

					</span>
					</span>
					<span className={s.block2}>
{/* 					<button className={s.btn1} onClick={() => setShowEmojiPicker(!showEmojiPicker)}> */}
{/*        				 {showEmojiPicker ? <LuSmilePlus size="18"/> : <LuSmilePlus size="18"/>} */}
{/*       				</button> */}
{/*      			 {showEmojiPicker && <div onMouseLeave={() => setShowEmojiPicker(!showEmojiPicker)}  className={s.EmojiContainer}> */}
{/*      			 <Picker  */}
{/*      			 className={s.emojiContent}  */}
{/*  */}
{/*      			 onEmojiClick={onEmojiClick} */}
{/*      			 disableSearchBar={false} /> */}
{/*      			 </div>} */}
     			
					<button className={s.btn2} onClick={()=>{handleAddPost(thisUser,postText,fileUrl,imageRef,forwardPost,tagUser,trackId)}}><HiMiniPlusSmall size="29" />{t("AddPost")}</button>
					
					</span>
				</span>

				 <div ref={animTagUsers} className={s.usersContainer}>
					<div className={s.userContent1}>{t('TagUser')}</div>
					<div className={s.userContent2}>
					<span className={s.userMiniContent1}>
							<TbUserSearch /><input type="search" />
					</span>
					{thisUser?.userData?.followers && users?.filter(user => thisUser.userData.followers.includes(user.id)).map(user => 
						<span className={s.userMiniContent2} >
							<img src={user?.photo?.placed || user?.photo?.default } className={s.userItem1} />
							<span className={s.userItem2}>{user.username}</span>
							<span className={s.userItem3} 
							onClick={()=>{
								setTagUser(user.id)
								setOpenUsers(false)
							}}><HiMiniPlusCircle /></span>
						</span>)}
					</div>
					<div className={s.userContent3}></div>
				</div>


					<div ref={animMusics} className={s.musicContainer}>
					<div className={s.musicContent1}>Add music to a post</div>
					<div className={s.musicContent2}>
					<span className={s.musicMiniContent1}>
							<TbMusicSearch /><input type="search" />
					</span>
					{musicsArray && musicsArray?.map(m => 
						<span className={s.musicMiniContent2} >
							<span style={{backgroundImage:`url(${m.trackImgUrl})`}} className={s.musicItem1} >
								<span>
								{play.musicId === m.id && play.playMusic === true
								? <span onClick={()=>{
									pauseMusic(m.id) 
									// setSrcMusicId(null)
								}}><FaPauseCircle /> </span>
								: <span onClick={()=>{
									playMusic(m.id,null,m.urlTrack)
									// setSrcMusicId(m.urlTrack)
								}}><FaCirclePlay /> </span> }
								</span>
							</span>
							<span className={s.musicItem2}>{m.trackName}</span>
							<span className={s.musicItem3} 
							onClick={()=>{
								setTrackId(m.id)
								setOpenMusic(false)
							}}><HiMiniPlusCircle /></span>
						</span>)}
					</div>
					<div className={s.userContent3}></div>
				</div>
				

			</div>

			{thisUser?.storyArray?.some(story=> story.highlight === true)
			? <div className={storyHeight ? `${s.storyContainer} ${s.activeStoryContainer}` : s.storyContainer}>
				<div className={s.storyContent1}>
				<span className={s.item1}>Highlights</span>
				{storyHeight 
					? <span className={s.item2} onClick={()=>setStoryHeight((prevStoryHeight)=>false)}><FaChevronCircleUp /></span>
					: <span className={s.item2} onClick={()=>setStoryHeight((prevStoryHeight)=>true)}><FaChevronCircleDown /></span>
				}
				</div>
				<span className={s.storyContent2}>
			{thisUser?.storyArray?.filter(story=> story.highlight === true).map(story=> 
				<div className={storyHeight ? `${s.activeCont} ${s.storyCont}` : s.storyCont}
				 onMouseLeave={()=>{setHidden(null)}} 
				 onMouseOver={()=>{setHidden(story.id)}}
				 onClick={()=>setStoryHeight((prevStoryHeight)=>true)}  
				 style={{backgroundImage:`url(${story.fileURL})`}}>
		{storyHeight ?
		<>
		<div className={s.storyItem1}>{story?.timeAdded}</div>
		<div className={hidden === story.id ? `${s.activeStory} ${s.storyItem3}` : s.storyItem3}>
			<button className={s.btn1} onClick={()=>{handleAddHighlight(story?.userId,story?.id)}}>Remove from highlights <BsHighlights/> </button>
		</div> 
		<div className={s.storyItem2}>
		<span className={s.item1}>{story?.storyText}</span>

		</div>
		</>
		: ""}
			</div>
					
			)}
			</span>
			</div>
			: ""}
			<div className={s.content3}>
			{/* {pinnedPost} */}
			{arrayPosts 
			? postThisUser.length > 0  ? postThisUser.reverse() : <div className={s.noPost}>{t('NoPosts')}</div>
			: <MiniLoader />}
			</div>
			
	</div>
	: <div className="noLogined">You are not authorized <Link to="/" className="btnLogin">Login</Link></div>
		)
}


export default React.memo(ProfilePage)