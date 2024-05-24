import { useState,useRef, useEffect , useContext} from 'react';
import s from './Login.module.scss'
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoKeyOutline } from "react-icons/io5";
import {Link} from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { MyContext } from './../../context/Context';
import {auth } from './../../firebase'



const Login = () => {

    const [email,setEmail] = useState(null)
    const [password,setPassword] = useState(null)
    const [error,setError] = useState(null)
    const btn = useRef(null)
    const animBlock = useRef()

    const {  logined, setLogined } = useContext(MyContext);


    const {t} = useTranslation()

    useEffect(()=>{
        let timer;

        if(animBlock.current){
        timer = setTimeout(()=>{animBlock.current.classList.add(s.animBlock)},200)
        }

        return ()=>{
            if(animBlock.current){
            clearTimeout(timer)
            animBlock.current.classList.remove(s.animBlock)
            }
        }

    },[])

    useEffect(()=>{
        if(!email  && !password ){
            btn.current.disabled = true
        } else {
            btn.current.disabled = false

        }
    },[email,password])

    const singIn = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    setEmail('')
    setPassword('')
    setError('')
    console.log(user)
    window.location.href = "/home"

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setError("Аккант не зарегистрирован,или не найден!")
  });
    }

    useEffect(()=>{
        if(logined){
        window.location.href = "/home"
    }
    },[logined])

    return (
        <main className={s.megaContainer}>
            
            <div className={s.megaContent}>
        
        <div className={s.container} ref={animBlock}>
                <span className={s.content1}>{t('login')}</span>
                <span className={s.content2}>
                    <span className={s.miniContent1}>{t('Email')}</span>
                    <span className={s.miniContent2}>
                    <MdOutlineMail size="25" />
                        <input 
                        type='email' 
                        value={email} 
                        name='email' 
                        placeholder="Email" 
                        onChange={(e)=>{
                            setEmail(e.target.value)
                        }}/>
                    </span>
                </span>
                <span className={s.content3}>
                    <span className={s.miniContent1}>{t('Password')}</span>
                    <span className={s.miniContent2}>
                    <RiLockPasswordLine size="25"/>
                        <input 
                        type='password' 
                        value={password} 
                        name='password' 
                        placeholder='Password' 
                        onChange={(e)=>{
                            setPassword(e.target.value)
                        }}/>
                        </span>
                 </span>
                <span className={s.content4}>
                    
                  <input type="checkbox" />
                  <span>{t("SaveMe")}</span>
                 
                </span>
                <span className={s.content5}>
                <span>{t('acctext2')}<Link to="/register">{t('signUp')}</Link></span>
                    <button onClick={singIn} ref={btn}>{t('login')}</button>
                    <p style={{color:"red"}}>{error}</p>
                </span>
            </div> 
            </div>
        </main>
    )
}


export default Login;