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
import {useLikePostMutation,usePostsQuery,useDislikePostMutation,useAddCommentToPostMutation,useDeletePostMutation,useFollowMutation,useUnfollowMutation,useDeleteComment,useSavePostToFavorite} from './../../../hooks/queryesHooks'
import { useQueryClient,useQuery } from 'react-query';
import { LuReplyAll } from "react-icons/lu";
import { MdOutlineCircle,MdCircle,MdOutlineReply,MdOutlineClose,MdBrightness1,MdDelete} from "react-icons/md";
import { FiLink } from "react-icons/fi";
import {parseTextWithLinks} from './../../../helper/linkFunction.js'
import { BsBookmarkPlus,BsBookmarkCheckFill } from "react-icons/bs";







const OtherPage = () => {

	const {userId} = useParams()

  const {  thisUser ,calculateTimeDifference,commentText,setCommentText,copyToClipboard,setNotificText,t,setActiveLink} = useContext(MyContext);


const queryClient = useQueryClient();

  const [openSettings,setOpenSettings] = useState(false)
  const [replyComment,setReplyComment] = useState(null)

 	const likePostMutation = useLikePostMutation();
  const dislikePostMutation = useDislikePostMutation()
  const addCommentPostMutation = useAddCommentToPostMutation()
  const deletePostMutation = useDeletePostMutation()
  const deleteCommentMutation = useDeleteComment()
  const savePostToFavoriteMutation = useSavePostToFavorite()
  
  const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));


	const selectedUser = users ? users?.find((user) => {
    if (userId && user && user.id.toString() === userId) {
        return true;
    }
    return false;
}) : null;



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

  const addCommentToPost = async (postId,userId,thisUser,commentText,replyComment) => {
  	try{
  		await addCommentPostMutation.mutate({postId,userId,thisUser,commentText,replyComment})
  		setCommentText("")
  		setNotificText(t('NotificComment'))

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





 let timer;

 useEffect (()=>{
 	if(animBlock.current){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }
 setActiveLink("/")

 return () => {
 	if(animBlock.current){
 	animBlock.current.classList.remove(s.animBlock)
 	clearTimeout(timer)
 }
 }
 },[])


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
							<img src={selectedUser?.photo?.placed || selectedUser?.photo?.default} alt="" />
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
						{m.imageURL 
						? <span className={s.item1}><img src={m.imageURL ? m.imageURL : <MiniLoader />} alt="" /></span>
						: "" }
						{m.postText 
						? <span className={s.item2}>
						{parseTextWithLinks(m.postText)}
						</span>
						: "" }
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
					             <Link to={thisUser?.id !== comment.userId ? `/home/user/profile/${comment.userId}` : "/home/profile"} ><img src={users?.find(user => user.id === comment.userId).photo?.placed  || users?.find(user => user?.id === comment.userId).photo?.default } alt="" /></Link>
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

						<div className={s.postCommentBlock2}>
							<span className={s.postCommentItem1}><img title={thisUser?.username} src={thisUser?.photo?.placed ||  thisUser?.photo?.default } alt="" /></span>
							<span className={s.postCommentItem2}>
							{!m.privateComment 
							? <input value={commentText[m.id] || ""} onChange={(e)=>{handleCommentChange(m.id,e.target.value)}} type="text" placeholder={t('AddComment')}/>
							: <input value={commentText[m.id] || ""} disabled="true" onChange={(e)=>{handleCommentChange(m.id,e.target.value)}} type="text" placeholder="..."/>}
							</span>
							{!m.privateComment 
							? <span className={s.postCommentItem3} onClick={()=>{addCommentToPost(m.id,thisUser?.id,thisUser,commentText[m.id],replyComment)}}><RiSendPlaneFill title="Send"/></span>
							: <span className={s.postCommentItem3} style={{opacity:"0.5"}}><RiSendPlaneFill title="Send"/></span> 
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
		<div className={s.megaContainer} ref={animBlock}>

		<div className={s.content1}>
		<div className={s.megaBlock}>
			<div ><BsThreeDotsVertical title="Edit profile"/></div>
			</div>
			<div className={s.megaBlock}>
			</div>
				<span className={s.Block1}>
				
				<span className={s.miniBlock1}><img src={selectedUser?.photo?.placed || selectedUser?.photo?.default } alt="" /></span>
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
					{!selectedUser?.private 
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
					<span className={s.miniBlock3}>
				<span className={s.miniBlock}>{selectedUser?.description ? selectedUser.description : "..."}</span>
					</span>
				{selectedUser?.link && selectedUser?.link !== ""
				? <span className={s.miniBlock5}>
					<span><FiLink /></span>
					<a href={selectedUser?.link} target="_blank">{selectedUser?.link}</a> 
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
			<div className={s.content2}>
			 { !selectedUser?.private 
			?
			arrayPosts 
			? postThisUser.length > 0 ? postThisUser.reverse() : <div className={s.noPost}>{t("NoPosts")}</div>
			: <MiniLoader />
			:
			thisUser?.isAdmin || thisUser?.userData?.following?.includes(selectedUser?.id)
			? arrayPosts 
			? postThisUser.length > 0 ? postThisUser.reverse() : <div className={s.noPost}>{t("NoPosts")}</div>
			: <MiniLoader />
			:<div className={s.closePage}>
				<span>{t('ClosedProfile')}</span>
				<HiLockClosed />
			</div> } 
			</div>
		</div>
		)
}


export default OtherPage;