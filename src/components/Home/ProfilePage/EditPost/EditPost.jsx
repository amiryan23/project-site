import s from './EditPost.module.scss'
import {useParams,Link} from "react-router-dom"
import React,{ useState,useCallback,useEffect,useContext,useRef} from 'react'
import { MyContext } from './../../../../context/Context';
import { AiOutlineRollback } from "react-icons/ai";
import MiniLoader from './../../../MiniLoader/MiniLoader'
import { doc, updateDoc } from "firebase/firestore";
import { RiCheckboxBlankCircleLine ,RiCheckboxCircleFill} from "react-icons/ri";
import {db,docId} from './../../../../firebase'
import { useQueryClient,useQuery } from 'react-query';








const EditPost = () => {

	const {id} = useParams()
 const {  thisUser ,calculateTimeDifference,commentText,setCommentText,setNotificText,t} = useContext(MyContext);

 const queryClient = useQueryClient();

		const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));

	const selectedPost = arrayPosts ? arrayPosts.find((post) => {
    if (id && post && post.id === parseInt(id, 10)) {
        return true;
    }
    return false;
}) : null;



	const [text,setText] = useState(selectedPost ? selectedPost.postText : "")
	const [error,setError] = useState("")
	const [accept,setAccept] = useState("")
	const [privateComment,setPrivateComment] = useState(selectedPost?.privateComment ? selectedPost.privateComment : false)
	const [privateForward,setPrivateForward] = useState(selectedPost?.privateForward ? selectedPost?.privateForward : false)
	const [hideLikeDislike,setHideLikeDislike] = useState(selectedPost?.hideLikeDislike ? selectedPost?.hideLikeDislike : false)

	const animBlock = useRef()

 let timer;

 useEffect (()=>{
 	if(animBlock.current){
 timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},10)
 }
 console.log(users)
 return () => {
 	if(animBlock.current){
 	animBlock.current.classList.remove(s.animBlock)
 	clearTimeout(timer)
 }
 }
 },[])


const handlerChangeInfo = async () => {
    try {
      if(text !== selectedPost.postText || privateComment !== selectedPost.privateComment || privateForward !== selectedPost?.privateForward || hideLikeDislike !== selectedPost?.hideLikeDislike){
      const postDocRef = doc(db, "posts", docId);

      
      const updatedArrayPosts = arrayPosts.map(post => {
        if (post.id === selectedPost.id) {
          return { ...post, postText: text,postChanged:true,privateComment:privateComment,privateForward:privateForward,hideLikeDislike:hideLikeDislike}; 
        }
        return post;
      });

      queryClient.setQueryData('arrayPosts',updatedArrayPosts)
      
      await updateDoc(postDocRef, { arrayPosts: updatedArrayPosts });

     
      setError("");
      setNotificText(t('NotificSettings'));
      setTimeout(()=>{window.history.back(-1)},50)
  }
    } catch (error) {
      console.error("Ошибка при обновлении данных поста:", error);
      
      setError("Ошибка");
      
    }
  };

	

	return (
		<div className={s.megaContainer} ref={animBlock}>
			<div className={s.content1}>
			<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button>
			</div>
			{selectedPost ?	<div className={s.postMegaContent} key={selectedPost.id}>
					<div className={s.postMiniContent1}>
						<span className={s.postBlock1}>
							<img src={users.find(user => user.id === selectedPost.userId).photo?.placed ? users.find(user => user.id === selectedPost.userId).photo?.placed : users.find(user => user.id === selectedPost.userId).photo?.default} alt="" />
						</span>
						<span className={s.postBlock2}>
							{selectedPost.user}
						</span>
						<span className={s.postBlock3}>
							{calculateTimeDifference(selectedPost.timeAdded)}
						</span>
					</div>
					<div className={s.postMiniContent2}>

						{selectedPost.imageURL 
						? <>
						<span>{t('ChnagePostPhoto')}</span>
						<span className={s.item1}><img src={selectedPost.imageURL ? selectedPost.imageURL : <MiniLoader />} alt="" /></span>
						</>
						: "" }
						<span>{t('ChangePostText')}</span>
						<input className={s.item2} value={text} type="text" onChange={(e)=>{setText(e.target.value)}} /> 
						<span className={s.item3} onClick={()=>{setPrivateComment((prevPrivateComment)=> !prevPrivateComment)}}>{t('DisableCom')} {privateComment ? <RiCheckboxCircleFill color="limegreen"/>  : <RiCheckboxBlankCircleLine/>}</span>
						<span className={s.item3} onClick={()=>{setPrivateForward((prevPrivateForward)=> !prevPrivateForward)}}>{t('DisableForward')} {privateForward? <RiCheckboxCircleFill color="limegreen"/>  : <RiCheckboxBlankCircleLine/>}</span>
						<span className={s.item3} onClick={()=>{setHideLikeDislike((prevHideLikeDislike)=> !prevHideLikeDislike)}}>{t('HideLikeDislike')} {hideLikeDislike? <RiCheckboxCircleFill color="limegreen"/>  : <RiCheckboxBlankCircleLine/>}</span>
					</div>
					</div>
					: "" }
					<div className={s.content3}>
						<button onClick={handlerChangeInfo}>{t('SaveChanges')}</button>
						{error && <p>{error}</p>}
					</div>
		</div>
		)
}

export default EditPost