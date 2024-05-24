import s from './CommentPage.module.scss'
import {useParams,Link} from "react-router-dom"
import React,{ useState,useCallback,useEffect,useContext,useRef} from 'react'
import { MyContext } from './../../../context/Context';
import { FaHeart,FaHeartBroken,FaComment } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import { AiOutlineRollback } from "react-icons/ai";
import MiniLoader from './../../MiniLoader/MiniLoader'
import { HiMiniLockClosed } from "react-icons/hi2";
import {useLikePostMutation,usePostsQuery,useDislikePostMutation,useAddCommentToPostMutation,useDeletePostMutation} from './../../../hooks/queryesHooks'
import { useQueryClient,useQuery } from 'react-query';
import { LuReplyAll } from "react-icons/lu";





const CommentPage = () => {

 const {  thisUser  ,calculateTimeDifference,commentText,setCommentText,setNotificText,t,setActiveLink} = useContext(MyContext);

 const queryClient = useQueryClient();

		const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));

	const {id} = useParams()

	const animBlock = useRef()

	const likePostMutation = useLikePostMutation();
  const dislikePostMutation = useDislikePostMutation()
  const addCommentPostMutation = useAddCommentToPostMutation()
  // const deletePostMutation = useDeletePostMutation()

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

  const addCommentToPost = async (postId,userId,thisUser,commentText) => {
  	try{
  		await addCommentPostMutation.mutate({postId,userId,thisUser,commentText})
  		setCommentText("")
  		setNotificText(t('NotificComment'))

  	}catch (error) {
  		console.error("Ошибка при добовления комментари")
  	}
  }

  // const handleDeleteItem = async (idToDelete) => {
  // 	try{
  // 		await deletePostMutation.mutate({idToDelete})
  // 		setNotificText("Пост успешно удалено")
  // 	}catch (error) {
  // 		console.error("Ошибка при удаления поста")
  // 	}
  // }

	return (
		<div className={s.megaContainer} ref={animBlock}>
		<div className={s.content1}>
			<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button>
		</div>
		{selectedPost ?	<div className={s.postMegaContent} key={selectedPost.id}>
					<div className={s.postMiniContent1}>
						<span className={s.postBlock1}>
							<img src={users?.find(user => user.id === selectedPost?.userId).photo?.placed || users?.find(user => user.id === selectedPost?.userId).photo?.default} alt="" />
						</span>
						<span className={s.postBlock2}>
							{selectedPost.user}
						</span>
						<span className={s.postBlock3}>
							{calculateTimeDifference(selectedPost.timeAdded)}
						</span>
						<span className={s.postBlock4}>
							{selectedPost.postChanged ?  `( ${t('Changed')} )` : ""}
						</span>
					</div>
					<div className={s.postMiniContent2}>
						{selectedPost.imageURL 
						? <span className={s.item1}><img src={selectedPost.imageURL ? selectedPost.imageURL : <MiniLoader />} alt="" /></span>
						: "" }
						{selectedPost.postText 
						? <span className={s.item2}>
						{selectedPost.postText}
						</span>
						: "" }
					</div>
					<div className={s.postMiniContent3}>
						{selectedPost.likes.includes(thisUser.id) 
						? <span onClick={()=>{handleLikePost(selectedPost.id,thisUser?.id)}}>
						<FaHeart title="Like" color="whitesmoke"/>
						{Array.isArray(selectedPost.likes) ? selectedPost.likes.length : 0}
						</span>
						:<span onClick={()=>{handleLikePost(selectedPost.id,thisUser?.id)}}>
						<FaHeart title="Like" />
						{Array.isArray(selectedPost.likes) ? selectedPost.likes.length : 0}
						</span> 
						}
						{selectedPost.dislikes.includes(thisUser?.id) 
						?  <span onClick={()=>{handleDislikePost(selectedPost.id,thisUser?.id)}}>
						<FaHeartBroken title="Dislike" color="whitesmoke"/>
						{Array.isArray(selectedPost.dislikes) ? selectedPost.dislikes.length : 0}
						</span> 
						: <span onClick={()=>{handleDislikePost(selectedPost.id,thisUser?.id)}}>
						<FaHeartBroken title="Dislike"/>
						{Array.isArray(selectedPost.dislikes) ? selectedPost.dislikes.length : 0}
						</span> 
						}
						{!selectedPost.privateComment 
						?<Link to={`/home/comment/post/${selectedPost.id}`}>
							<span><FaComment title="Comments"/>{selectedPost.commentArray.length}</span>
						</Link>
						:
							<span><FaComment title="Comments"/><HiMiniLockClosed color="#888" size="15"/></span>
						 }
						{!selectedPost.privateForward 
						?<Link onClick={()=>{
							localStorage.setItem("forwardPost",JSON.stringify({
								fwPostid:selectedPost.id,
								fwPosttext:selectedPost.postText,
								fwPostImage:selectedPost.imageURL ? selectedPost.imageURL : "",
								fwPostUser:selectedPost.user
							}))
						}} to={`/home/profile`}>
							<span><LuReplyAll title="forward" /></span>
						</Link>
						: <span><LuReplyAll title="forward"/><HiMiniLockClosed color="#888" size="15"/></span> }
					</div>
					<div className={s.postMiniContent4}>
						{!selectedPost.privateComment 
						? <div className={s.postCommentBlock1}>
							{selectedPost.commentArray.length !== 0
							?  selectedPost.commentArray.map(comment => (
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
							
							: <div className={s.noComment}>
								{t('NоComments')}
							</div>}
						</div>
						: <div className={s.privateComment}>
								<div className={s.item}>{t("ClosedComment")}<HiMiniLockClosed color="#999" size="52"/></div>
							</div> }
						<div className={s.postCommentBlock2}>
							<span className={s.postCommentItem1}><img title={thisUser.username} src={thisUser?.photo?.placed || thisUser?.photo?.default} alt="" /></span>
							<span className={s.postCommentItem2}>
							{!selectedPost.privateComment 
							? <input value={commentText} onChange={(e)=>{setCommentText(e.target.value)}} type="text" placeholder="Comment"/>
							: <input value={commentText} disabled="true" onChange={(e)=>{setCommentText(e.target.value)}} type="text" placeholder="..."/>}
							</span>
							{!selectedPost.privateComment 
							? <span className={s.postCommentItem3} onClick={()=>{addCommentToPost(selectedPost.id,thisUser?.id,thisUser,commentText)}}><RiSendPlaneFill title="Send"/></span>
							: <span className={s.postCommentItem3} style={{opacity:"0.5"}}><RiSendPlaneFill title="Send"/></span> 
							}
						</div>

					</div>

				</div> 
				: <MiniLoader />}

  
		</div>
		)
}

export default React.memo(CommentPage)