import s from './Modal.module.scss'
import ReactDOM from 'react-dom';
import React,{useCallback,useContext} from 'react'
import { IoMdClose } from "react-icons/io";
import { MyContext } from './../../context/Context';

const Modal = React.memo(()=>{


  const {  openModal,setOpenModal,zoomThisPhoto } = useContext(MyContext);

   const thisPhotoStorage = localStorage.getItem("thisPhotoZoom")

	const handlePortalClose = useCallback(()=>{
		setTimeout(()=>{localStorage.removeItem("thisPhotoZoom")},500)
		setOpenModal(false)
	},[openModal])

	return ReactDOM.createPortal(
		<dialog className={s.Container} open={openModal} onClick={handlePortalClose}>
			<div className={s.content}>
				<img src={thisPhotoStorage} alt="" />
			</div>
		</dialog>,
    document.getElementById('modal')
		)
})

export default Modal