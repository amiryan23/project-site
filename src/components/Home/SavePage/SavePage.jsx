import s from './SavePage.module.scss'
import React,{ useState,useCallback,useEffect,useContext,useRef,useMemo } from 'react'
import { MyContext } from './../../../context/Context';
import { useQueryClient,useQuery } from 'react-query';
import { BsBookmarkXFill } from "react-icons/bs";
import {useSavePostToFavorite} from './../../../hooks/queryesHooks'
import {Link} from 'react-router-dom'
import { AiOutlineRollback } from "react-icons/ai";


const SavePage = () => {

	const {  thisUser,calculateTimeDifference,commentText,setCommentText,setNotificText,copyToClipboard,t,setActiveLink} = useContext(MyContext);

	 const queryClient = useQueryClient();

	  	const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));
    const { data: arrayPosts } = useQuery('arrayPosts', () => queryClient.getQueryData('arrayPosts'));

      const savePostToFavoriteMutation = useSavePostToFavorite()

        const handleSaveToFavorite = async (postId,userId) => {
  	try {
  		await savePostToFavoriteMutation.mutate({postId,userId})
  		console.log("Успешно добавлен в сохранение")

  		
  	} catch	(error) {
  		console.log("Ошибка при добовления поста в избранное")
  	}
  }

	const animBlock = useRef()

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

    const savedPosts = arrayPosts ? 
    arrayPosts
    .filter(post => post.savingThisPost?.includes(thisUser?.id))
    .map(m => 
    	<div key={m.id} className={s.megaContent}>
    	<Link to={`/home/comment/post/${m.id}`} className={s.miniContent1}>
    		<img src={users?.find(user => user.id === m.userId).photo?.placed || users?.find(user => user.id === m.userId).photo?.default } alt="" />
    		<span>{users?.find(user => user.id === m.userId).username}</span>
    	</Link>
    	<Link to={`/home/comment/post/${m.id}`} className={s.miniContent2}>
    		{m.imageURL ? 
    		<img src={m.imageURL} alt="" />
    		: ""}
    		{m.postText &&
    		 <span>{m.imageURL ? `${m.postText.slice(0,65)}...` :  m.postText.slice(0,1000)}  </span> }
    	</Link>
    	<div onClick={()=>{
    		handleSaveToFavorite(m.id,thisUser?.id)
    		setNotificText(t('RemoveSaved'))
    	}} className={s.miniContent3}>
    		<span>{t('RemoveFromSaved')}</span>
    		 <BsBookmarkXFill />
    	</div>
    	</div>
    	)
    : ""
	return (
		<div className={s.megaContainer} ref={animBlock}>
			<div className={s.content1}>
				<button onClick={() => window.history.back(-1)}><AiOutlineRollback size="30" color="whitesmoke"/></button>
				<span>{t('Saved')}</span>
			</div>
			<div className={s.content2}>
				{savedPosts?.length > 0 ? savedPosts : <div className={s.noSaved}>{t("NoSaved")}</div>}
			</div>
		</div>
		)
}

export default SavePage