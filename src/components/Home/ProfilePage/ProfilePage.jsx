import s from './ProfilePage.module.scss'
import React,{ useState,useCallback,useEffect,useContext,useRef} from 'react'
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdOutlineAttachFile } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import { HiMiniPlusSmall } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import {Link} from 'react-router-dom'
import {  collection, doc, setDoc, getDoc , updateDoc } from "firebase/firestore";
import { getStorage,ref, uploadBytes } from "firebase/storage";
import { FaHeart,FaHeartBroken , FaComment } from "react-icons/fa";
import { MyContext } from './../../../context/Context';
import { RiSendPlaneFill,RiCloseLine } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import MiniLoader from './../../MiniLoader/MiniLoader'
import { MdEdit,MdDeleteForever,MdOutlineClose} from "react-icons/md";
import { IoCopySharp } from "react-icons/io5";
import { HiMiniLockClosed } from "react-icons/hi2";
import {firebaseConfig,db,storage,docId} from './../../../firebase'
import {useLikePostMutation,usePostsQuery,useDislikePostMutation,useAddCommentToPostMutation,useDeletePostMutation,useAddPostMutation} from './../../../hooks/queryesHooks'
import { useQueryClient,useQuery } from 'react-query';
import { MdOutlineCircle,MdCircle } from "react-icons/md";
import { AiOutlineRollback } from "react-icons/ai";








const ProfilePage = ()=>{

 const {   isWideScreen ,calculateTimeDifference,commentText,setCommentText,copyToClipboard,setNotificText,t,setActiveLink} = useContext(MyContext);

 	const forwardPostStorage = JSON.parse(localStorage.getItem("forwardPost"))

	const queryClient = useQueryClient();
 	const [postText,setPostText] = useState("")
  const [fileUrl, setFileUrl] = useState(null);
  const [showFile,setShowFile] = useState(false)
  const [openSettings,setOpenSettings] = useState(null)
  const [forwardPost,setForwardPost] = useState(forwardPostStorage ? forwardPostStorage : null)
 
	const likePostMutation = useLikePostMutation();
  const dislikePostMutation = useDislikePostMutation()
  const addCommentPostMutation = useAddCommentToPostMutation()
  const deletePostMutation = useDeletePostMutation()
  const addPostMutation = useAddPostMutation()

  	const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: thisUser } = useQuery('thisUser', () => queryClient.getQueryData('thisUser'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));

 const animBlock = useRef()
 const imageRef = useRef()

 let timer;

 useEffect (()=>{
 	if(animBlock.current){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }

 setActiveLink("/profile")

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

  const handleAddPost = async (thisUser,postText,fileUrl,imageRef,forwardPost) => {
  	try{
  		if(postText !== "" || fileUrl !== null){
  		await addPostMutation.mutate({thisUser,postText,fileUrl,imageRef,forwardPost})
  		setPostText("")
      setFileUrl("")
      setForwardPost(null)
  		setNotificText(t('NotificPostAdd'))
  		localStorage.removeItem("forwardPost")
  	} else {
  		setNotificText(t('Error'))
  	}
  	}catch (error) {
  		console.error("Ошибка при добовления поста")
  	}
  }




  useEffect(()=>{
  	if(fileUrl){
  		setShowFile(true)
  	} else {
  		setShowFile(false)

  	}
  },[fileUrl])





  const postThisUser = arrayPosts 
  ? arrayPosts
  .filter(m => m.userId === thisUser?.id) 
  	.map(m => 		<div className={s.postMegaContent} key={m.id}>

					<div className={s.postMiniContent1}>
						<span className={s.postBlock1}>
							<img src={thisUser?.photo?.placed ? thisUser?.photo?.placed : thisUser?.photo?.default} alt="" />
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
						{openSettings === m.id 
						? <span className={s.item2} >
							<Link to={`/home/profile/edit/post/${m.id}`} className={s.miniItem1}><MdEdit/><span>{t("Edit")}</span></Link>
							<span className={s.miniItem2} onClick={()=>{
								copyToClipboard(`http://localhost:3000/home/comment/post/${m.id}`)
								setOpenSettings(null)
								
							}}><IoCopySharp/>{t("CopyLink")}</span>
							<span className={s.miniItem3} onClick={()=>{
								handleDeleteItem(m.id)
        				

							}}><MdDeleteForever/><span>{t("Delete")}</span></span>
						</span> 
						: "" }
					</span>
					</div>
					<div className={s.postMiniContent2}>
					{m.forwardPost !== undefined &&  m.forwardPost !== ""
				? <Link className={s.fwPost} to={`/home/comment/post/${m.forwardPost.fwPostid}`}>

					<span className={s.fwItem1}>
					<span className={s.miniFwitem1}>
					{t('Forward')}
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
					             <img src={users?.find(user => user.id === comment.userId).photo?.placed ? users?.find(user => user.id === comment.userId).photo?.placed : users?.find(user => user.id === comment.userId).photo?.default} alt="" />
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
							<span className={s.postCommentItem1}><img title={thisUser.username} src={thisUser?.photo?.placed ? thisUser?.photo?.placed : thisUser?.photo?.default} alt="" /></span>
							<span className={s.postCommentItem2}>
							{!m.privateComment 
							? <input value={commentText} onChange={(e)=>{setCommentText(e.target.value)}} type="text" placeholder="Comment"/>
							: <input value={commentText} disabled="true" onChange={(e)=>{setCommentText(e.target.value)}} type="text" placeholder="..."/>}
							</span>
							<span className={s.postCommentItem3} onClick={()=>{addCommentToPost(m.id,thisUser?.id,thisUser,commentText)}}><RiSendPlaneFill title="Send"/></span>
						</div>

					</div>

				</div>)

  : <MiniLoader />



	return (

    <div className={s.megaContainer} ref={animBlock}>

			<div className={s.content1}>
			<div className={s.megaBlock}>
			<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button>
			<Link  to="/home/settings"><IoSettingsSharp title="Edit profile"/></Link>
			</div>
				<span className={s.Block1}>

				<span className={s.miniBlock1}>
				<img src={thisUser?.photo?.placed ? thisUser?.photo?.placed : thisUser?.photo?.default} alt="" />
				</span>
				<span className={s.miniBlock2}>
					{thisUser ? thisUser.username : <MiniLoader/>}
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
				<span className={s.miniBlock3}>
				<span className={s.miniBlock}>{thisUser?.description || "..."}</span>
					</span>
					{thisUser ? 
					<span className={s.miniBlock1}>
					<span className={s.infoContent}>
					<span>{t("Age")}:<span className={s.item}> {thisUser.age}</span></span> 
					<span>{t("Country")}:<span className={s.item}> {thisUser.country ? thisUser.country : t('NotIndicated')}</span></span> 
					<span>{t("City")}: <span className={s.item}> {thisUser.city ? thisUser.city : t('NotIndicated')}</span></span> 
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
				<span className={s.miniBlock3}>{t("AddPost")}</span>
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
					<input ref={imageRef} id="file" type="file" style={{display:"none"}} onChange={handleFileChange}/>
						<label htmlFor="file" >
						<MdOutlineAddPhotoAlternate title="Photo" />
						</label>
						<GrAttachment title="File" />
					</span>
					</span>
					<span className={s.block2}>
					
					<button onClick={()=>{handleAddPost(thisUser,postText,fileUrl,imageRef,forwardPost)}}><HiMiniPlusSmall />{t("AddPost")}</button>
					
					</span>
				</span>

			</div>
			<div className={s.content3}>
			{arrayPosts 
			? postThisUser.length > 0 ? postThisUser.reverse() : <div className={s.noPost}>{t('NoPosts')}</div>
			: <MiniLoader />}
			</div>
			
	</div>
		)
}


export default React.memo(ProfilePage)