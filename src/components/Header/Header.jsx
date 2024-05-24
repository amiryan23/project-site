import React,{ useState,useCallback,useEffect,useContext } from 'react'
import s from './Header.module.scss'
import {Link} from 'react-router-dom'
// import { FaAngleDown,FaGripLines } from "react-icons/fa";
// import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useTranslation } from 'react-i18next';
import { MyContext } from './../../context/Context';
import MiniLoader from './../MiniLoader/MiniLoader'
import { CgMenu } from "react-icons/cg";
import Logo from './../../assets/logo.png'
import NotificationUser from './NotificationUser/NotificationUser'
import { useQueryClient,useQuery } from 'react-query';
import Language from './../Language/Language'

const Header = ()=> {
        
const [openNotific,setOpenNotific] = useState(false)

     const {   logined,thisUser, setLogined  , isWideScreen , openMenu,setOpenMenu} = useContext(MyContext);


const queryClient = useQueryClient();


    const {t} = useTranslation()





 

    return (
        <header className={s.megaContainer}>
        {isWideScreen && logined ? <div className={s.content} onClick={()=>{setOpenMenu(true)}}><CgMenu size="25" color="whitesmoke" /></div> : ""}
            <div className={s.content1}>
                <img src={Logo} alt="" width="150"/>
            </div>
            <div className={s.content2}>
              {isWideScreen ? ""
              : <Language /> }
                {/* <NotificationUser />  */}
                {logined 
                ?   <span className={s.megaContent} onMouseLeave={()=>{setOpenNotific(false)}}>
                      <span className={s.miniItem1}>
                      <span className={s.miniContent2}>
                          <NotificationUser openNotific={openNotific} setOpenNotific={setOpenNotific}/>
                      </span>
                        <span className={s.miniContent1}>
                          <Link to="/home/profile" ><img src={thisUser?.photo?.placed ? thisUser?.photo?.placed  : thisUser?.photo?.default } alt="" /></Link>
                        </span> 
                        <span className={s.miniContent2}>
                      {/* {thisUser  */}
                      {/*   ? thisUser.username */}
                      {/*   : <MiniLoader />} */}
                        </span>
                        </span>
                    
                    </span> 
                :<span className={s.miniBlock2}>
                <Link className={s.item1} to="/" >{t('login')}</Link>
                <span className={s.item2}>||</span> 
                <Link className={s.item3} to="/register " >{t('signUp')}</Link>
                </span> }
                </div>
        </header>
    )
}

export default React.memo(Header);