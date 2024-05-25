import s from './Footer.module.scss'
import {Link} from 'react-router-dom'
import { MyContext } from './../../context/Context';
import React,{ useState,useCallback,useEffect,useContext,useRef  } from 'react'



const Footer = () => {

 const {  t,setActiveLink} = useContext(MyContext);

	return (
		<footer className={s.megaContainer}>
		<div className={s.megaContent1}>
			<div className={s.content1}>
				<span className={s.Block1}>BetaTesting.com</span>
		
			</div>
			<div className={s.content2}>
					<span className={s.Block1}>Navigation</span>
				<span className={s.Block2}>
				<div className={s.miniBlock1}>
					<Link to="home" className={s.item}>{t('Home')}</Link>
					<Link to="home/profile" className={s.item}>{t('Profile')}</Link>
					<Link to="home/users" className={s.item}>{t('Users')}</Link>
				</div>
				<div className={s.miniBlock2}>
					<Link to="home/music" className={s.item}>{t('Music')}</Link>
					{/* <span className={s.item}>Site Updates</span> */}
					{/* <span className={s.item}>Notifications page</span> */}
					<Link to="home/settings" className={s.item}>{t('Settings')}</Link>
				</div>
				</span>
			</div>
			<div className={s.content3}>
							<span className={s.Block1}>Help</span>
				<span className={s.Block2}>
				<div className={s.miniBlock1}>
					<Link className={s.item}>Help & FAQ</Link>
					<Link className={s.item}>About project</Link>
				</div>
				</span>
			</div>
			<div className={s.content4}>
				<span className={s.Block1}>
					Support
				</span>
				<span className={s.Block2}>
					betatesting@gmail.com
				</span>
			</div>
			</div>
			<div className={s.megaContent2}>
				<div className={s.content}>© 2024 <Link to="/home/user/profile/M7EOY6gQCgWHNg9nUveIT442zFm1">user23</Link> </div>
				
			</div>
		</footer>
		)
}


export default Footer