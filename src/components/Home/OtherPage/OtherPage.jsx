import s from './OtherPage.module.scss'
import {useParams,Link} from "react-router-dom"
import React,{ useState,useCallback,useEffect,useContext,useRef,Suspense} from 'react'
import { MyContext } from './../../../context/Context';
import MiniLoader from './../../MiniLoader/MiniLoader'
import Loading from './../../Loading/Loading'
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiUserFollowFill,RiUserUnfollowFill,RiUserReceivedFill  } from "react-icons/ri";
import { FaHeart,FaHeartBroken , FaComment } from "react-icons/fa";
import { RiSendPlaneFill,RiCloseLine } from "react-icons/ri";
import { MdEdit,MdDeleteForever} from "react-icons/md";
import { IoCopySharp } from "react-icons/io5";
import { MdReport } from "react-icons/md";
import { HiLockClosed } from "react-icons/hi";
import { HiMiniLockClosed } from "react-icons/hi2";
import { Route, Routes  } from 'react-router-dom';
import { useHandleFollow  } from './../../../context/auth';
import {useViewStory} from "./../../../hooks/queryesHooks"
import {useLikePostMutation,usePostsQuery,useDislikePostMutation,useAddCommentToPostMutation,useDeletePostMutation,useFollowMutation,useUnfollowMutation,useDeleteComment,useSavePostToFavorite} from './../../../hooks/queryesHooks'
import { useQueryClient,useQuery } from 'react-query';
import { LuReplyAll } from "react-icons/lu";
import { MdOutlineCircle,MdCircle,MdOutlineReply,MdOutlineClose,MdBrightness1,MdDelete} from "react-icons/md";
import { FiLink } from "react-icons/fi";
import {parseTextWithLinks} from './../../../helper/linkFunction.js'
import { BsBookmarkPlus,BsBookmarkCheckFill } from "react-icons/bs";
import { IoMdPhotos } from "react-icons/io";
import { AiOutlineRollback } from "react-icons/ai";
import { FaUserTag } from "react-icons/fa6";
import { FaCirclePlay  } from "react-icons/fa6";
import { FaPauseCircle } from "react-icons/fa";
import { IoIosMusicalNotes } from "react-icons/io";
import {isWithin24Hours} from './../../../helper/timeAdded'
import { FaChevronCircleDown , FaChevronCircleUp } from "react-icons/fa";
import {InstagramEmbedLoader} from './../../../helper/instaPost'
import {TelegramEmbedLoader} from './../../../helper/telegramPost'
import Zoom from 'react-medium-image-zoom'





const OtherPage = () => {

	const {userId} = useParams()

  const {  thisUser,logined ,calculateTimeDifference,commentText,setCommentText,copyToClipboard,setNotificText,t,setActiveLink,fileUrls, setFileUrls,zoomThisPhoto,srcMusicId,setSrcMusicId,setOpenStoryModal,setViewStory} = useContext(MyContext);


const queryClient = useQueryClient();

  const [openSettings,setOpenSettings] = useState(false)
  const [replyComment,setReplyComment] = useState(null)
  const [trackId,setTrackId] = useState(null)
  const [play,setPlay] = useState({ musicId: null, postId: null, playMusic: false })
  const [storyHeight,setStoryHeight] = useState(false)

 	const likePostMutation = useLikePostMutation();
  const dislikePostMutation = useDislikePostMutation()
  const addCommentPostMutation = useAddCommentToPostMutation()
  const deletePostMutation = useDeletePostMutation()
  const deleteCommentMutation = useDeleteComment()
  const savePostToFavoriteMutation = useSavePostToFavorite()
  const viewStoryMutation = useViewStory()
  
  
  const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));
    const { data: musicsArray } = useQuery('musicsArray', () => queryClient.getQueryData('musicsArray'));


	const selectedUser = users ? users?.find((user) => {
    if (userId && user && user.id.toString() === userId) {
        return true;
    }
    return false;
}) : null;


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

    const handleSaveToFavorite = async (postId,userId) => {
  	try {
  		await savePostToFavoriteMutation.mutate({postId,userId})
  		console.log("Успешно добавлен в сохранение")

  		
  	} catch	(error) {
  		console.log("Ошибка при добовления поста в избранное")
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
  		setNotificText(t('NotificDel'))
  	}catch (error) {
  		console.error("Ошибка при удаления поста")
  	}
  }

	const animBlock = useRef()

	
const followMutation = useFollowMutation()
const unfollowMutation = useUnfollowMutation()

    const handleFollow = async ( user ) => {
    try {
      await followMutation.mutate({ user });
      console.log("добавлен в подписки ");
     
    } catch (error) {
      console.error("Ошибка при добавлен в подписки", error);
    }
  };

  const handleUnfollow = async (user) => {
  	try{
  		console.log('Запрос на отписку отправлен');
  		await unfollowMutation.mutate({ user });
      
  	}catch(error){
  		console.error("Ошибка при удаление подписки", error)
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


const handleViewStory = async (userId,thisUser) => {
	try{
		await viewStoryMutation.mutate({userId,thisUser})
	}catch(error){
		console.error(error)
	}
}


const handleFileChange = useCallback((e, postId) => {
 
  if (e.target.files && e.target.files.length > 0) {
 
    const thisFile = e.target.files[0];
    const url = URL.createObjectURL(thisFile);

    setFileUrls(prevFileUrls => ({
      ...prevFileUrls,
      [postId]: {url:url,file:thisFile}

    }));
  }

}, []);

 let timer;

 useEffect (()=>{
	if(animBlock.current && logined){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }

 setActiveLink("/")

 return () => {
	setSrcMusicId((prevMusicId)=>null)
	if(animBlock.current && !logined){
	animBlock.current.classList.remove(s.animBlock)
	clearTimeout(timer)
 }
 }
 },[logined])


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
  .filter(m => m.userId === selectedUser?.id) 
  	.map(m => 		<div className={s.postMegaContent} key={m.id}>
					<div className={s.postMiniContent1}>
						<span className={s.postBlock1}>
							<img src={selectedUser?.photo?.placed || selectedUser?.photo?.default} alt="" 
							className={users?.find(user=> user.id === selectedUser.id)?.storyArray?.some(story => isWithin24Hours(story?.timeAdded)) ? users?.find(user=> user.id === selectedUser.id)?.storyArray[users?.find(user => user.id === selectedUser.id)?.storyArray.length - 1]?.view?.includes(thisUser?.id) ? s.viewedstory : s.activeStory : ""}/>
							<span>
							{!selectedUser.disableOnlineStatus || thisUser?.isAdmin 
							? selectedUser.onlineStatus  ? <MdCircle title="Online" size="11" color="limegreen"/> : <MdBrightness1 title="Offline" size="11" color="rgba(256,256,256,0.8)"/>
							: "" }
							</span>
						</span>
						<span className={s.postBlock2}>
							{selectedUser.username}
						</span>
						<span className={s.postBlock3}>
							{calculateTimeDifference(m.timeAdded)}
						</span>
						<span className={s.postBlock4}>
							{m.postChanged ?  `( ${t('Changed')} )` : ""}
						</span>
							<span className={s.postSettings} onMouseLeave={()=>{setOpenSettings(null)}}>
						<span onClick={()=>{ setOpenSettings(m.id) }} className={s.item1}><BsThreeDotsVertical /></span>
						{thisUser?.isAdmin ?
						openSettings === m.id 
						? 
						<span className={s.item2} >
							<Link to={`/home/profile/edit/post/${m.id}`} className={s.miniItem1}><MdEdit/><span>{t("Edit")}</span></Link> 
							<span className={s.miniItem2} onClick={()=>{
								copyToClipboard(`https://cospulse.netlify.app//home/comment/post/${m.id}`)
								setOpenSettings(false)}
							}><IoCopySharp/>{t("CopyLink")}</span>
						 <span className={s.miniItem4} onClick={()=>{
								handleSaveToFavorite(m.id,thisUser?.id)
								if(m.savingThisPost?.includes(thisUser?.id)){
									setNotificText(t('RemoveSaved'))
								} else{
									setNotificText(t('AddSaved'))
								}
								setOpenSettings(false)
							}}>
							{m.savingThisPost?.includes(thisUser?.id) 
							?<span><BsBookmarkCheckFill />{t('Remove')}</span>
							:<span><BsBookmarkPlus />{t('Save')}</span>}
							</span> 
							<span className={s.miniItem3} onClick={()=>{handleDeleteItem(m.id)}}><MdDeleteForever/><span>{t("Delete")}</span></span> 
						</span> 
						: "" 
						: 
						openSettings === m.id
						? <span className={s.item2} >
							<span className={s.miniItem1} onClick={()=>{
								copyToClipboard(`http://localhost:3000/home/comment/post/${m.id}`)
								setOpenSettings(false)
							}}><IoCopySharp/>{t("CopyLink")}</span> 
						{!selectedUser.private  
						? !m.forwardPost ? <span className={s.miniItem4} onClick={()=>{
								handleSaveToFavorite(m.id,thisUser?.id)
								if(m.savingThisPost?.includes(thisUser?.id)){
									setNotificText("RemoveSaved")
								} else{
									setNotificText("AddSaved")
								}
								setOpenSettings(false)
							}}>
							{m.savingThisPost?.includes(thisUser?.id) 
							?<span><BsBookmarkCheckFill />{t('Remove')}</span>
							:<span><BsBookmarkPlus />{t('Save')}</span>}
							</span> 
							: ""
							: ""}							
							<span className={s.miniItem3} ><MdReport/><span>{t("Report")}</span></span> 
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
						{m.imageURL && !m.postText
						? <span className={s.item1}><Zoom isZoomed={true}><img src={m.imageURL ? m.imageURL : <MiniLoader />} alt="" /></Zoom></span>
						: "" }
						{m.videoURL && !m.postText
						? <span className={s.videoItem} >
							
						<video controls playsInline allowfullscreen="false" >
          	<source src={m.videoURL}  type="video/mp4" />
          
        		</video>
        		</span>
        		: ""}
						{m.postText 
						? <span className={s.item2}>
						{m.imageURL 
						? <span className={s.item1}><Zoom isZoomed={true}><img src={m.imageURL ? m.imageURL : <MiniLoader />} alt="" /></Zoom></span>
						: "" }
						{m.videoURL
						? <span className={s.videoItem} >
							
						<video controls playsInline allowfullscreen="false" >
          	<source src={m.videoURL}  type="video/mp4" />
          
        		</video>
        		</span>
        		: ""}
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
					{play.musicId === musicsArray?.find(music => music.id === m.trackId).id && play.playMusic === true && play.postId === m.id
		? <span onClick={()=>{pauseMusic(musicsArray?.find(music => music.id === m.trackId).id,m.id)}}><FaPauseCircle /> </span>
		: <span onClick={()=>{playMusic(musicsArray?.find(music => music.id === m.trackId).id,m.id,musicsArray?.find(music => music.id === m.trackId).urlTrack)}}><FaCirclePlay /> </span> }</span>
					</div>
					: ""}
					</div>
					<div className={s.postMiniContent3}>
						{m.likes.includes(thisUser?.id) 
						? <span onClick={()=>{handleLikePost(m.id,thisUser?.id)}}>
						<FaHeart title="Like" color="whitesmoke"/>
						{!m.hideLikeDislike ? Array.isArray(m.likes) ? m.likes.length : 0 : ""}
						</span>
						:<span onClick={()=>{handleLikePost(m.id,thisUser?.id)}}>
						<FaHeart title="Like" />
						{!m.hideLikeDislike ? Array.isArray(m.likes) ? m.likes.length : 0 : ""}
						</span> 
						}
						{m.dislikes.includes(thisUser?.id) 
						?  <span onClick={()=>{handleDislikePost(m.id,thisUser?.id)}}>
						<FaHeartBroken title="Dislike" color="whitesmoke"/>
						{!m.hideLikeDislike ? Array.isArray(m.dislikes) ? m.dislikes.length : 0 : ""}
						</span> 
						: <span onClick={()=>{handleDislikePost(m.id,thisUser?.id)}}>
						<FaHeartBroken title="Dislike"/>
						{!m.hideLikeDislike ? Array.isArray(m.dislikes) ? m.dislikes.length : 0 : ""}
						</span> 
						}
						{!m.privateComment 
						?<Link to={`/home/comment/post/${m.id}`}>
							<span><FaComment title="Comments"/>{m.commentArray.length}</span>
						</Link>
						:
							<span><FaComment title="Comments"/><HiMiniLockClosed color="#888" size="15"/></span>
						 }
						{!m.privateForward 
						?<Link onClick={()=>{
							localStorage.setItem("forwardPost",JSON.stringify({
								fwPostid:m.id,
								fwPosttext:m.postText,
								fwPostImage:m.imageURL ? m.imageURL : "",
								fwPostUser:m.user
							}))
						}} to={`/home/profile`}>
							<span><LuReplyAll title="forward" /></span>
						</Link>
						: <span><LuReplyAll title="forward"/><HiMiniLockClosed color="#888" size="15"/></span> }
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
					             className={users?.find(user=> user.id === comment.userId)?.storyArray?.some(story => isWithin24Hours(story?.timeAdded)) ? users?.find(user=> user.id === comment.userId)?.storyArray[users?.find(user => user.id === comment.userId)?.storyArray.length - 1]?.view?.includes(thisUser?.id) ? s.viewedstory : s.activeStory : ""}/></Link>
					            {!users?.find(user => user.id === comment.userId).disableOnlineStatus || thisUser?.isAdmin 
					             ? <span>
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
					             : "" }
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
					            		<Zoom isZoomed={true}><img src={comment.imgUrl} alt="" width="100px"/></Zoom>
					            	</div>
					            	: ""}
					            	<div className={s.miniItem2}>
					              {comment.commentText}
					              </div>
					            </span>
					          </div>
					         <div className={s.Block3} >
					          <button onClick={()=>{ handleReplyComment(m.id,comment)}}><MdOutlineReply title="reply" /></button>
					         {thisUser?.id === comment.userId || thisUser?.isAdmin ? <button onClick={()=>{handleDeleteComment(m.id,comment.id)}}>	<MdDelete title="delete"/> </button> : ""}
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
							<span className={s.postCommentItem1}><img title={thisUser?.username} src={thisUser?.photo?.placed ||  thisUser?.photo?.default } alt="" /></span>
							<span className={s.postCommentItem2}>
							{!m.privateComment 
							? <textarea value={commentText[m.id] || ""} onChange={(e)=>{handleCommentChange(m.id,e.target.value)}} type="text" placeholder={t('AddComment')}/>
							: <textarea value={commentText[m.id] || ""}  disabled="true" onChange={(e)=>{handleCommentChange(m.id,e.target.value)}} type="text" placeholder="..."/>}
							</span>
							{!m.privateComment 
							? <span className={s.postCommentItem3}>
							<input  id={`fileUrl-${[m.id]}`} type="file" onChange={(e)=>{handleFileChange(e,m.id)}}  />
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


  useEffect(()=>{
  	if(userId === thisUser?.id){
  		window.location.href = "/home/profile"
  	}
  },[userId])


	return (
		logined
		? <div className={s.megaContainer} ref={animBlock}>

		<div className={s.content1}>
		<div className={s.megaBlock}>
		<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button>
			<div ><BsThreeDotsVertical title="Edit profile"/></div>
			</div>
				<span className={s.Block1}>
					<span className={s.miniBlock3}>
				<span className={s.miniBlock}>{selectedUser?.description ? selectedUser.description : "..."}</span>
					</span>				
				<span className={s.miniBlock1}>
<img onClick={
					()=>(selectedUser?.storyArray?.some(story => isWithin24Hours(story.timeAdded))
					? (setOpenStoryModal(true), 
						setViewStory(true) , 
						handleViewStory(selectedUser?.id,thisUser),
						localStorage.setItem("thisUserStoryData",JSON.stringify(selectedUser?.id)))
					:zoomThisPhoto(selectedUser?.photo?.placed ? selectedUser?.photo?.placed : selectedUser?.photo?.default))
				} src={selectedUser?.photo?.placed ? selectedUser?.photo?.placed : selectedUser?.photo?.default} alt="" 
				className={selectedUser?.storyArray?.some(story => isWithin24Hours(story?.timeAdded)) ? selectedUser?.storyArray[users?.find(user => user.id === selectedUser.id)?.storyArray.length - 1]?.view?.includes(thisUser?.id) ? s.viewedstory : s.activeStory : ""} />
				</span>
				<span className={s.miniBlock2}>
					{selectedUser ? selectedUser?.username : <MiniLoader/>}
				</span>
				<span className={s.miniBlock3}>
							{selectedUser?.userData && selectedUser.userData?.requests?.includes(thisUser?.id)
					? <button className={s.btn3} onClick={()=>{handleFollow(selectedUser)}}><RiUserReceivedFill/>{t("Req")}</button>
					:
					thisUser?.userData && thisUser?.userData?.following?.includes(selectedUser.id)
					? <button className={s.btn2} onClick={()=>{handleUnfollow(selectedUser)}}><RiUserUnfollowFill/>{t('Unflw')}</button> 
					: <button className={s.btn1} onClick={()=>{handleFollow(selectedUser)}}><RiUserFollowFill/>{t('Flw')}</button>
					}
					</span>
				</span>
				<span className={s.Block2}>
				<span className={s.miniBlock4}>
					{!selectedUser?.private || thisUser?.isAdmin || users?.userData?.followers?.includes(thisUser?.id) 
					?
					<>
					{selectedUser?.userData?.followers?.length > 0
					? <Link to="followers" className={s.btn1}>
					<span className={s.item1}>{selectedUser ? selectedUser?.userData?.followers?.length : 0}</span>
					<span>{t("Followers")}</span>
					</Link>
					: <span className={s.btn1}>
					<span className={s.item1}>{selectedUser ? selectedUser?.userData?.followers?.length : 0}</span>
					<span>{t("Followers")}</span>
					</span> }
					{selectedUser?.userData?.following?.length > 0
					? <Link to="following" className={s.btn2}>
					<span className={s.item1}>{selectedUser ? selectedUser?.userData?.following?.length : 0}</span>
					<span>{t("Following")}</span>
					</Link>
					: <span  className={s.btn2}>
					<span className={s.item1}>{selectedUser ? selectedUser?.userData?.following?.length : 0}</span>
					<span>{t("Following")}</span>
					</span> }
					</>
					: 
					<>
					<span className={s.btn1}>
					<span className={s.item1}>{selectedUser ? selectedUser?.userData?.followers?.length : 0}</span>
					<span>{t("Followers")}</span>
					</span>
					<span  className={s.btn2}>
					<span className={s.item1}>{selectedUser ? selectedUser?.userData?.following?.length : 0}</span>
					<span>{t("Following")}</span>
					</span>
					</>
					}
				</span>
				{/* 	<span className={s.miniBlock3}> */}
				{/* <span className={s.miniBlock}>{selectedUser?.description ? selectedUser.description : "..."}</span> */}
				{/* 	</span> */}
				{selectedUser?.link && selectedUser?.link !== ""
				? <span className={s.miniBlock5}>
					<span><FiLink /></span>
					<a href={selectedUser?.link} target="_blank">{selectedUser?.link?.length >= 30 ? `${selectedUser?.link.slice(0,30)}...` : selectedUser?.link}</a> 
				</span>
				: ""}
					{selectedUser ? 
					<span className={s.miniBlock1}>
					
					<span className={s.infoContent}>
					<span>{t("Age")}:<span className={s.item}> {selectedUser.age}</span></span> 
					<span>{t("Country")}:<span className={s.item}> {selectedUser.country  ? selectedUser.country : t('NotIndicated')}</span></span> 
					<span>{t("City")}: <span className={s.item}> {selectedUser.city  ? selectedUser.city : t('NotIndicated')}</span></span> 
					</span>
					{!selectedUser.disableOnlineStatus || thisUser?.isAdmin 
					? <span className={s.statusContent}>
						{selectedUser.onlineStatus
						? <span className={s.onlineStatus}>
						{t("Online")} <MdCircle />
						</span>
				 		: <span className={s.offlineStatus}> 
					 	{t("Oflline")} <MdOutlineCircle />
					 	</span> }
					</span>
					: "" }
					</span>
					: <MiniLoader/>}
					{/* <span className={s.miniBlock2}> */}
					{/* 		{selectedUser?.userData && selectedUser.userData?.requests?.includes(thisUser.id) */}
					{/* ? <button className={s.btn3} onClick={()=>{handleFollow(selectedUser)}}><RiUserReceivedFill/>Request</button> */}
					{/* : */}
					{/* thisUser?.userData && thisUser?.userData?.following?.includes(selectedUser.id) */}
					{/* ? <button className={s.btn2} onClick={()=>{handleUnfollow(selectedUser)}}><RiUserUnfollowFill/>Unfollow</button>  */}
					{/* : <button className={s.btn1} onClick={()=>{handleFollow(selectedUser)}}><RiUserFollowFill/>Follow</button> */}
					{/* } */}
					{/* </span> */}

				</span>
			</div>
			{(selectedUser?.storyArray?.some(story=> story?.highlight === true) && !selectedUser?.private ) || (selectedUser?.storyArray?.some(story=> story?.highlight === true) && !selectedUser?.userData?.followers?.includes(thisUser?.id))
			? <div className={storyHeight ? `${s.storyContainer} ${s.activeStoryContainer}` : s.storyContainer}>
				<div className={s.storyContent1}>
				<span className={s.item1}>Highlights</span>
				{storyHeight 
					? <span className={s.item2} onClick={()=>setStoryHeight((prevStoryHeight)=>false)}><FaChevronCircleUp /></span>
					: <span className={s.item2} onClick={()=>setStoryHeight((prevStoryHeight)=>true)}><FaChevronCircleDown /></span>
				}
				</div>
				<span className={s.storyContent2}>
			{selectedUser?.storyArray?.filter(story=> story.highlight === true).map(story=> 
				// <Zoom isZoomed={true}>
				<div className={storyHeight ? `${s.activeCont} ${s.storyCont}` : s.storyCont} onClick={()=>setStoryHeight((prevStoryHeight)=>true)}  style={{backgroundImage:`url(${story.fileURL})`}}>
		{storyHeight ?
		<>
		
		<div className={s.storyItem1}>{calculateTimeDifference(story?.timeAdded)}</div>
	
		<div className={s.storyItem2}>
		<span className={s.item1}>{story?.storyText}</span>

		</div>
		
		</>
		: ""}
	</div>

					
			).reverse()}
			</span>
			</div>
			: ""}
			<div className={s.content2}>
			 { !selectedUser?.private 
			?
			arrayPosts 
			? postThisUser.length > 0 ? postThisUser.reverse() : <div className={s.noPost}>{`${selectedUser.username} ${t("UserNoPosts")}`}</div>
			: <MiniLoader />
			:
			thisUser?.isAdmin || thisUser?.userData?.following?.includes(selectedUser?.id)
			? arrayPosts 
			? postThisUser.length > 0 ? postThisUser.reverse() : <div className={s.noPost}>{`${selectedUser.username} ${t("UserNoPosts")}`}</div>
			: <MiniLoader />
			:<div className={s.closePage}>
				<span>{t('ClosedProfile')}</span>
				<HiLockClosed />
			</div> } 
			</div>
				
		</div>
		: <div className="noLogined">You are not authorized <Link to="/" className="btnLogin">Login</Link></div>
		)
}


export default OtherPage;