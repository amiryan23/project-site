import { useState,useRef, useEffect , useContext} from 'react';
import s from './Login.module.scss'
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoKeyOutline } from "react-icons/io5";
import {Link} from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { MyContext } from './../../context/Context';
import {auth } from './../../firebase'
import { BsFillEyeFill,BsFillEyeSlashFill } from "react-icons/bs";


const Login = () => {

    const [email,setEmail] = useState(null)
    const [password,setPassword] = useState(null)
    const [saveMe,setSaveMe] = useState(false)
    const [error,setError] = useState(null)
    const [passHide,setPassHide] = useState(true)
    const btn = useRef(null)
    const animBlock = useRef()
    const passRef = useRef()

    const {  logined, setLogined , t } = useContext(MyContext);


   

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

        if(passHide && passRef.current){
            passRef.current.type = "password"
        } else if(!passHide && passRef.current) {
            passRef.current.type = "text"
        }
    },[email,password,passHide])

    const singIn = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    setEmail('')
    setPassword('')
    setError('')
    if(saveMe){
        localStorage.setItem("saveMe",true)
    }
    window.location.href = "/home"


    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setError(t('authError'))
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
                        ref={passRef} 
                        onChange={(e)=>{
                            setPassword(e.target.value)
                        }}/>
                        {passHide ? <span onClick={()=>{setPassHide((prevPassHide)=>!prevPassHide)}} className={s.hidePass}><BsFillEyeFill/></span> : <span onClick={()=>{setPassHide((prevPassHide)=>!prevPassHide)}} className={s.hidePass}><BsFillEyeSlashFill /></span>}
                        </span>
                 </span>
                <span className={s.content4}>
                    
                  <input value={saveMe} type="checkbox" onClick={()=>{setSaveMe(!saveMe)}}/>
                  <span>{t("SaveMe")}</span>
                 
                </span>
                <span className={s.content5}>
                <span>{t('acctext2')}<Link to="/register">{t('signUp')}</Link></span>
                    <button onClick={singIn} ref={btn}>{t('login')}</button>
                    <p style={{color:"red",fontSize:11,alignSelf:"center"}}>{error}</p>
                </span>
            </div> 
            </div>
        </main>
    )
}


export default Login;