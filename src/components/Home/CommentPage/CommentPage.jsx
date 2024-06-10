import s from './CommentPage.module.scss'
import {useParams,Link} from "react-router-dom"
import React,{ useState,useCallback,useEffect,useContext,useRef} from 'react'
import { MyContext } from './../../../context/Context';
import { FaHeart,FaHeartBroken,FaComment } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import { AiOutlineRollback } from "react-icons/ai";
import MiniLoader from './../../MiniLoader/MiniLoader'
import { HiMiniLockClosed } from "react-icons/hi2";
import {useLikePostMutation,usePostsQuery,useDislikePostMutation,useAddCommentToPostMutation,useDeletePostMutation,useDeleteComment} from './../../../hooks/queryesHooks'
import { useQueryClient,useQuery } from 'react-query';
import { LuReplyAll } from "react-icons/lu";
import { MdOutlineReply,MdOutlineClose } from "react-icons/md";
import { MdCircle,MdBrightness1,MdDelete } from "react-icons/md";
import {parseTextWithLinks} from './../../../helper/linkFunction.js'
import { IoMdPhotos } from "react-icons/io";
import { FaUserTag } from "react-icons/fa6";


const CommentPage = () => {

 const {  thisUser  ,calculateTimeDifference,commentText,setCommentText,setNotificText,t,setActiveLink,fileUrls, setFileUrls} = useContext(MyContext);

 const queryClient = useQueryClient();

		const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));

	const {id} = useParams()

	const animBlock = useRef()

	const likePostMutation = useLikePostMutation();
  const dislikePostMutation = useDislikePostMutation()
  const addCommentPostMutation = useAddCommentToPostMutation()
  const deleteCommentMutation = useDeleteComment()

  const [replyComment,setReplyComment] = useState(null)

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

	const selectedPost = arrayPosts ? arrayPosts.find((post) => {
    if (id && post && post.id === parseInt(id, 10)) {
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


  // const handleDeleteItem = async (idToDelete) => {
  // 	try{
  // 		await deletePostMutation.mutate({idToDelete})
  // 		setNotificText("Пост успешно удалено")
  // 	}catch (error) {
  // 		console.error("Ошибка при удаления поста")
  // 	}
  // }

   const handleDeleteComment = async (postId,commentIdToDelete) => {
  	try{

 		await deleteCommentMutation.mutate({postId,commentIdToDelete})
  		setNotificText(t('NotificComtDel'))

  	}catch (error){
  		console.error("Ошибка при удаления комментари",error)
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



	return (
		<div className={s.megaContainer} ref={animBlock}>
		<div className={s.content1}>
			<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button>
		</div>
		{selectedPost ?	<div className={s.postMegaContent} key={selectedPost?.id}>
					<div className={s.postMiniContent1}>
						<span className={s.postBlock1}>
							<img src={users?.find(user => user.id === selectedPost?.userId).photo?.placed || users?.find(user => user.id === selectedPost?.userId).photo?.default} alt="" />
						</span>
						<span className={s.postBlock2}>
							{users?.find(user=> user.id === selectedPost?.userId).username}
						</span>
						<span className={s.postBlock3}>
							{calculateTimeDifference(selectedPost?.timeAdded)}
						</span>
						<span className={s.postBlock4}>
							{selectedPost?.postChanged ?  `( ${t('Changed')} )` : ""}
						</span>
					</div>
					<div className={s.postMiniContent2}>
						{selectedPost?.imageURL 
						? <span className={s.item1}><img src={selectedPost?.imageURL ? selectedPost?.imageURL : <MiniLoader />} alt="" /></span>
						: "" }
						{selectedPost?.postText 
						? <span className={s.item2}>
						{parseTextWithLinks(selectedPost?.postText)}
						</span>
						: "" }
						{selectedPost.taggedUser !== undefined && selectedPost.taggedUser !== null 
						? <Link to={`/home/user/profile/${users?.find(user=> user.id === selectedPost.taggedUser).id}`} className={s.taggedUserContainer}>
							
							<FaUserTag /> 
							@{users?.find(user=> user.id === selectedPost.taggedUser).username}
							
							</Link>
							: ""}						
					</div>
					<div className={s.postMiniContent3}>
						{selectedPost?.likes.includes(thisUser?.id) 
						? <span onClick={()=>{handleLikePost(selectedPost?.id,thisUser?.id)}}>
						<FaHeart title="Like" color="whitesmoke"/>
						{!selectedPost.hideLikeDislike ? Array.isArray(selectedPost?.likes) ? selectedPost?.likes.length : 0 : ""}
						</span>
						:<span onClick={()=>{handleLikePost(selectedPost?.id,thisUser?.id)}}>
						<FaHeart title="Like" />
						{!selectedPost.hideLikeDislike ? Array.isArray(selectedPost?.likes) ? selectedPost?.likes.length : 0 : ""}
						</span> 
						}
						{selectedPost.dislikes.includes(thisUser?.id) 
						?  <span onClick={()=>{handleDislikePost(selectedPost?.id,thisUser?.id)}}>
						<FaHeartBroken title="Dislike" color="whitesmoke"/>
						{!selectedPost.hideLikeDislike ? Array.isArray(selectedPost?.dislikes) ? selectedPost?.dislikes.length : 0 : ""}
						</span> 
						: <span onClick={()=>{handleDislikePost(selectedPost?.id,thisUser?.id)}}>
						<FaHeartBroken title="Dislike"/>
						{!selectedPost.hideLikeDislike ? Array.isArray(selectedPost?.dislikes) ? selectedPost?.dislikes.length : 0 : ""}
						</span> 
						}
						{!selectedPost?.privateComment 
						?<Link to={`/home/comment/post/${selectedPost.id}`}>
							<span><FaComment title="Comments"/>{selectedPost.commentArray.length}</span>
						</Link>
						:
							<span><FaComment title="Comments"/><HiMiniLockClosed color="#888" size="15"/></span>
						 }
						{!selectedPost.privateForward 
						?<Link onClick={()=>{
							localStorage.setItem("forwardPost",JSON.stringify({
								fwPostid:selectedPost?.id,
								fwPosttext:selectedPost?.postText,
								fwPostImage:selectedPost?.imageURL ? selectedPost?.imageURL : "",
								fwPostUser:selectedPost?.user
							}))
						}} to={`/home/profile`}>
							<span><LuReplyAll title="forward" /></span>
						</Link>
						: <span><LuReplyAll title="forward"/><HiMiniLockClosed color="#888" size="15"/></span> }
					</div>
					<div className={s.postMiniContent4}>
						{!selectedPost?.privateComment 
						? <div className={s.postCommentBlock1}>
							{selectedPost?.commentArray.length !== 0
							?  selectedPost?.commentArray.map(comment => (
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
					             : ""}
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
					          <button onClick={()=>{ handleReplyComment(selectedPost.id,comment)}}><MdOutlineReply title="reply" /></button>
					         {thisUser?.id === comment.userId || thisUser?.isAdmin || thisUser?.id === selectedPost.userId ? <button onClick={()=>{handleDeleteComment(selectedPost.id,comment.id)}}>	<MdDelete title="delete"/> </button> : ""}
					          </div>				          
					        </div>
					      ))
							
							: <div className={s.noComment}>
								{t('NоComments')}
							</div>}
						</div>
						: <div className={s.privateComment}>
								<div className={s.item}>{t("ClosedComment")}<HiMiniLockClosed color="#999" size="52"/></div>
							</div> }

							{replyComment !== null && replyComment[selectedPost?.id] ? 
							<div className={s.replyContainer} ref={replyCommentRef}>
							<div className={s.replyMegaContent1}>
							<div className={s.replyContent1}>
								{t('inReply')} {users?.find(user => user.id === replyComment[selectedPost?.id]?.userId).username}
							</div>
							<div className={s.replyContent2} onClick={()=>{
								localStorage.removeItem("thisComment")
								setReplyComment(null)
							}}>
								<MdOutlineClose />
							</div>
							</div>
							<div className={s.replyMegaContent2}>
								{replyComment[selectedPost?.id]?.commentText}
							</div>
							</div>
							:"" }
							{fileUrls[selectedPost.id]?.url &&
							 <div className={s.imgContainer}>
							 <img src={fileUrls[selectedPost.id]?.url} alt="Preview" width="100px" /> 
							 <span onClick={() => {
				 				 setFileUrls(prevFileUrls => {
		   						 const updatedFileUrl = { ...prevFileUrls };
		   						 delete updatedFileUrl[selectedPost.id];
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
							{!selectedPost.privateComment 
							? <textarea value={commentText[selectedPost.id] || ""} onChange={(e)=>{handleCommentChange(selectedPost.id,e.target.value)}} type="text" placeholder={t('AddComment')}/>
							: <textarea value={commentText[selectedPost.id] || ""}  disabled="true" onChange={(e)=>{handleCommentChange(selectedPost.id,e.target.value)}} type="text" placeholder="..."/>}
							</span>
							{!selectedPost.privateComment 
							? <span className={s.postCommentItem3}>
							<input  id={`fileUrl-${[selectedPost.id]}`} type="file" onChange={(e)=>{
								handleFileChange(e,selectedPost.id)
							
							}}  />
							<label htmlFor={`fileUrl-${[selectedPost.id]}`} className={s.item1}><IoMdPhotos/></label>
							<span  onClick={()=>{
								addCommentToPost(selectedPost.id,thisUser?.id,thisUser,commentText[selectedPost.id],replyComment,fileUrls[selectedPost.id]?.file)
								 setFileUrls(prevFileUrls => {
		   						 const updatedFileUrl = { ...prevFileUrls };
		   						 delete updatedFileUrl[selectedPost.id];
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

				</div> 
				: <MiniLoader />}

  
		</div>
		)
}

export default React.memo(CommentPage)