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
import {useLikePostMutation,usePostsQuery,useDislikePostMutation,useAddCommentToPostMutation,useDeletePostMutation,useFollowMutation,useUnfollowMutation} from './../../../hooks/queryesHooks'
import { useQueryClient,useQuery } from 'react-query';
import { LuReplyAll } from "react-icons/lu";
import { MdOutlineCircle,MdCircle } from "react-icons/md";








const OtherPage = () => {

	const {userId} = useParams()

  const {  thisUser ,calculateTimeDifference,commentText,setCommentText,copyToClipboard,setNotificText,t,setActiveLink} = useContext(MyContext);


const queryClient = useQueryClient();

  const [openSettings,setOpenSettings] = useState(false)

 	const likePostMutation = useLikePostMutation();
  const dislikePostMutation = useDislikePostMutation()
  const addCommentPostMutation = useAddCommentToPostMutation()
  const deletePostMutation = useDeletePostMutation()
  
  const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));


	const selectedUser = users ? users.find((user) => {
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


	const postThisUser = arrayPosts 
  ? arrayPosts
  .filter(m => m.userId === selectedUser.id) 
  	.map(m => 		<div className={s.postMegaContent} key={m.id}>
					<div className={s.postMiniContent1}>
						<span className={s.postBlock1}>
							<img src={selectedUser?.photo?.placed || selectedUser?.photo?.default} alt="" />
						</span>
						<span className={s.postBlock2}>
							{m.user}
						</span>
						<span className={s.postBlock3}>
							{calculateTimeDifference(m.timeAdded)}
						</span>
						<span className={s.postBlock4}>
							{m.postChanged ?  `( ${t('Changed')} )` : ""}
						</span>
							<span className={s.postSettings} onMouseLeave={()=>{setOpenSettings(null)}}>
						<span onClick={()=>{ setOpenSettings(m.id) }} className={s.item1}><BsThreeDotsVertical /></span>
						{thisUser.isAdmin ?
						openSettings === m.id 
						? 
						<span className={s.item2} >
							<Link to={`/home/profile/edit/post/${m.id}`} className={s.miniItem1}><MdEdit/><span>{t("Edit")}</span></Link> 
							<span className={s.miniItem2} onClick={()=>{
								copyToClipboard(`http://localhost:3000/home/comment/post/${m.id}`)
								setOpenSettings(false)}
							}><IoCopySharp/>{t("CopyLink")}</span>
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
							
							<span className={s.miniItem3} ><MdReport/><span>{t("Report")}</span></span> 
						</span> 
						: "" }
					</span>
					</div>
					<div className={s.postMiniContent2}>
						{m.forwardPost !== undefined &&  m.forwardPost !== ""
				? <Link className={s.fwPost} to={`/home/comment/post/${m.forwardPost.fwPostid}`}>
					<span className={s.fwItem1}>
					<span className={s.miniFwitem1}>
					{t("Forward")}
					</span>
					<Link to={`/home/user/profile/${arrayPosts.find(post => post.id === m.forwardPost.fwPostid).userId}`} className={s.miniFwitem2}>
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
				: "" }
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
						{m.likes.includes(thisUser.id) 
						? <span onClick={()=>{handleLikePost(m.id,thisUser.id)}}>
						<FaHeart title="Like" color="whitesmoke"/>
						{Array.isArray(m.likes) ? m.likes.length : 0}
						</span>
						:<span onClick={()=>{handleLikePost(m.id,thisUser.id)}}>
						<FaHeart title="Like" />
						{Array.isArray(m.likes) ? m.likes.length : 0}
						</span> 
						}
						{m.dislikes.includes(thisUser.id) 
						?  <span onClick={()=>{handleDislikePost(m.id,thisUser.id)}}>
						<FaHeartBroken title="Dislike" color="whitesmoke"/>
						{Array.isArray(m.dislikes) ? m.dislikes.length : 0}
						</span> 
						: <span onClick={()=>{handleDislikePost(m.id,thisUser.id)}}>
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
					             <img src={users?.find(user => user.id === comment.userId).photo?.placed || users?.find(user => user.id === comment.userId).photo?.default } alt="" />
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
								{t('NоComments')}
							</div>}
						</div>
						: <div className={s.privateComment}>
								<div className={s.item}>{t("ClosedComment")}<HiMiniLockClosed color="#999" size="52"/></div>
							</div> }
						<div className={s.postCommentBlock2}>
							<span className={s.postCommentItem1}><img title={thisUser.username} src={thisUser?.photo?.placed ||  thisUser?.photo?.default } alt="" /></span>
							<span className={s.postCommentItem2}>
							{!m.privateComment 
							? <input value={commentText} onChange={(e)=>{setCommentText(e.target.value)}} type="text" placeholder="Comment"/>
							: <input value={commentText} disabled="true" onChange={(e)=>{setCommentText(e.target.value)}} type="text" placeholder="..."/>}
							</span>
							{!m.privateComment 
							? <span className={s.postCommentItem3} onClick={()=>{addCommentToPost(m.id,thisUser.id)}}><RiSendPlaneFill title="Send"/></span>
							: <span className={s.postCommentItem3} style={{opacity:"0.5"}}><RiSendPlaneFill title="Send"/></span> 
							}	
						</div>

					</div>

				</div>)

  : <MiniLoader />


  useEffect(()=>{
  	if(userId === thisUser.id){
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
					{selectedUser ? selectedUser.username : <MiniLoader/>}
				</span>
				<span className={s.miniBlock3}>
							{selectedUser?.userData && selectedUser.userData?.requests?.includes(thisUser.id)
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
					{selectedUser ? 
					<span className={s.miniBlock1}>
					
					<span className={s.infoContent}>
					<span>{t("Age")}:<span className={s.item}> {selectedUser.age}</span></span> 
					<span>{t("Country")}:<span className={s.item}> {selectedUser.country  ? selectedUser.country : t('NotIndicated')}</span></span> 
					<span>{t("City")}: <span className={s.item}> {selectedUser.city  ? selectedUser.city : t('NotIndicated')}</span></span> 
					</span>
					<span className={s.statusContent}>
						{selectedUser.onlineStatus
						? <span className={s.onlineStatus}>
						{t("Online")} <MdCircle />
						</span>
				 		: <span className={s.offlineStatus}> 
					 	{t("Oflline")} <MdOutlineCircle />
					 	</span> }
					</span>
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
			thisUser.isAdmin || thisUser.userData?.following?.includes(selectedUser.id)
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