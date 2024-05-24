import s from './HomePage.module.scss'
import { MyContext } from './../../../context/Context';
import {  collection, doc, setDoc, getDoc , updateDoc } from "firebase/firestore";
import React,{ useState,useCallback,useEffect,useContext,useRef } from 'react'
import { FaHeart,FaHeartBroken,FaComment } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import {Link} from 'react-router-dom'
import MiniLoader from './../../MiniLoader/MiniLoader'
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit,MdDeleteForever} from "react-icons/md";
import { IoCopySharp,IoReturnUpForward } from "react-icons/io5";
import { MdReport } from "react-icons/md";
import { FaArrowTurnDown,FaArrowTurnUp  } from "react-icons/fa6";
import { HiMiniLockClosed } from "react-icons/hi2";
import { LuReplyAll } from "react-icons/lu";
import {useLikePostMutation,usePostsQuery,useDislikePostMutation,useAddCommentToPostMutation,useDeletePostMutation} from './../../../hooks/queryesHooks'
import { useQueryClient,useQuery } from 'react-query';





const HomePage = ()=>{

 const {  thisUser,calculateTimeDifference,commentText,setCommentText,setNotificText,copyToClipboard,t,setActiveLink} = useContext(MyContext);

 const queryClient = useQueryClient();

  
  const likePostMutation = useLikePostMutation();
  const dislikePostMutation = useDislikePostMutation()
  const addCommentPostMutation = useAddCommentToPostMutation()
  const deletePostMutation = useDeletePostMutation()
  
  	const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));
// const { data: thisUser } = useQuery('thisUser', () => queryClient.getQueryData('thisUser'));
    

  const [openSettings,setOpenSettings] = useState(false)
  const [arrayLength,setArrayLength] = useState(4)

 const animBlock = useRef()

 let timer;

 useEffect (()=>{
 	if(animBlock.current){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }

setActiveLink("/home")
 
 return () => {
 	if(animBlock.current){
 	animBlock.current.classList.remove(s.animBlock)
 	clearTimeout(timer)
 }
 }
 },[])


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

  const addCommentToPost = async (postId,userId,thisUser,commentText) => {
  	try{
  		await addCommentPostMutation.mutate({postId,userId,thisUser,commentText})
  		setCommentText("")
  		setNotificText(t('NotificComment'))

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

	const allPosts = arrayPosts 
  ? arrayPosts
 	.filter(post => !users?.some(user => user.id === post.userId && user.private ) && !post.forwardPost)
 	.map(m => 		<div className={s.postMegaContent} key={m.id}>
					<div className={s.postMiniContent1}>
						<span className={s.postBlock1}>
							<Link to={thisUser?.id !== m.userId ? `/home/user/profile/${m.userId}` : "/home/profile"}><img src={users?.find(user => user.id === m.userId).photo?.placed ? users?.find(user => user?.id === m.userId).photo?.placed : users?.find(user => user?.id === m.userId).photo?.default} alt="" /></Link>
						</span>
						<span className={s.postBlock2}>
							{m.user}
						</span>
						<span className={s.postBlock3}>
							{calculateTimeDifference(m.timeAdded)}
						</span>
						<span className={s.postBlock4}>
							{m.postChanged ? `( ${t('Changed')} )` : ""}
						</span>
							<span className={s.postSettings} onMouseLeave={()=>{setOpenSettings(null)}}>
						<span onClick={()=>{ setOpenSettings(m.id) }} className={s.item1}><BsThreeDotsVertical /></span>
						{thisUser?.isAdmin ?
						openSettings === m.id 
						? <span className={s.item2} >
							<Link to={`/home/profile/edit/post/${m.id}`} className={s.miniItem1}><MdEdit/><span>{t("Edit")}</span></Link> 
							<span className={s.miniItem2} onClick={()=>{
								copyToClipboard(`http://localhost:3000/home/comment/post/${m.id}`)
								setOpenSettings(false)
							}}><IoCopySharp/>{t("CopyLink")}</span>
							<span className={s.miniItem3} onClick={()=>{handleDeleteItem(m.id)}}><MdDeleteForever/><span>{t("Delete")}</span></span> 
						</span> 
						: "" 
						: openSettings === m.id
						? <span className={s.item2} >
							<span className={s.miniItem1} onClick={()=>{
								copyToClipboard(`http://localhost:3000/home/comment/post/${m.id}`)
								setOpenSettings(false)
							}}><IoCopySharp/>{t("CopyLink")}</span> 
							
							<span className={s.miniItem3} ><MdReport/><span>{t("Report")}</span></span> 
						</span> 
						: "" }
					</span>
					</div>
					<div className={s.postMiniContent2}>
						{m.imageURL 
						? <span className={s.item1}><img src={m.imageURL ? m.imageURL : <MiniLoader />} alt="" /></span>
						: "" }
						{m.postText 
						? <span className={s.item2}>
						{m.postText}
						</span>
						: "" }
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
					             <img src={users?.find(user => user.id === comment.userId).photo?.placed  || users?.find(user => user?.id === comment.userId).photo?.default} alt="" />
					            </span>
					          </div>
					          <div className={s.Block2}>
					            <span className={s.item1}>
					              <span className={s.miniItem1}>{comment.userName}</span>
					              <span className={s.miniItem2}>{calculateTimeDifference(comment.timeAdded)}</span>

					            </span>
					            <span className={s.item2}>
					              {comment.commentText}
					            </span>
					          </div>
					        </div>
					      ))
							.slice(m.commentArray.length - 2,m.commentArray.length )
							: <div className={s.noComment}>
								{t("NоComments")}
							</div>}
						</div>
						: <div className={s.privateComment}>
								<div className={s.item}>{t('ClosedComment')}<HiMiniLockClosed  size="52"/></div>
							</div> }
						<div className={s.postCommentBlock2}>
							<span className={s.postCommentItem1}><img title={thisUser?.username} src={thisUser?.photo?.placed ? thisUser?.photo?.placed  : thisUser?.photo?.default } alt="" /></span>
							<span className={s.postCommentItem2}>
							{!m.privateComment 
							? <input value={commentText} onChange={(e)=>{setCommentText(e.target.value)}} type="text" placeholder="Comment"/>
							: <input value={commentText} disabled="true" onChange={(e)=>{setCommentText(e.target.value)}} type="text" placeholder="..."/>}
							</span>
							{!m.privateComment 
							? <span className={s.postCommentItem3} onClick={()=>{addCommentToPost(m.id,thisUser?.id,thisUser,commentText)}}><RiSendPlaneFill title="Send"/></span>
							: <span className={s.postCommentItem3} style={{opacity:"0.5"}}><RiSendPlaneFill title="Send"/></span> 
							}	
						</div>

					</div>

				</div>)

  : <MiniLoader />


  



	return (
		<div className={s.megaContent} ref={animBlock}>
			<span className={s.content1}>{t('Publication')}</span>
			{arrayPosts ? allPosts.reverse().slice(0,arrayLength) : <MiniLoader />}
			<span className={s.content2}>
			{arrayLength <= allPosts.length	
			?<button onClick={()=>{
					setArrayLength((prevArrayLength)=>prevArrayLength + 4)
				}}>{t('ViewMore')}<FaArrowTurnDown /></button> 
			: arrayLength > 4 
			?<button onClick={()=>{
					setArrayLength(4)
				}}>{t('Hide')}<FaArrowTurnUp  /></button> 
				: "" }
			</span>
		</div>

		)
}

export default React.memo(HomePage)