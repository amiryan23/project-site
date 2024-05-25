import { useState,useRef, useEffect,useContext } from 'react';
import s from './Registration.module.scss'
import {Link} from 'react-router-dom'
import { MdCheckBoxOutlineBlank,MdCheckBox  } from "react-icons/md";
import { MyContext } from './../../context/Context';
import { createUserWithEmailAndPassword } from "firebase/auth";
import {  doc, setDoc} from "firebase/firestore";
import {auth,db } from './../../firebase'
import { useQueryClient,useQuery } from 'react-query';


const Registration = ()=>{
    const [username,setUsername] = useState()
    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const [copypassword,setCopypassword] = useState()
    const [age,setAge] = useState()
    const [error,setError] = useState()
    const [checkbox,setCheckbox]=useState(false)

    const animBlock = useRef()
    const rePassRef = useRef()
    const userRef = useRef()

    const { logined , t } = useContext(MyContext);

 const queryClient = useQueryClient();

 const { data: users } = useQuery('users', () => queryClient.getQueryData('users'));

     

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
        if( password !==  copypassword && rePassRef.current){
        rePassRef.current.classList.add(s.rePassInvalid)
       
    } else if( password ===  copypassword && rePassRef.current){
        rePassRef.current.classList.remove(s.rePassInvalid)

    }   



    },[password,copypassword])


   const userNameVerify = users ?
   users?.some((user) => user.username?.toLowerCase() === username?.toLowerCase())
   : ""

    useEffect(()=>{
        
        if(userNameVerify && userRef.current){
            userRef.current.classList.add(s.userInvalid)
        } else if (!userNameVerify && userRef.current) {
            userRef.current.classList.remove(s.userInvalid)
        }
    },[username,userNameVerify])



    const register = (e) => {
    e.preventDefault()
     if( password !== copypassword && !checkbox && userNameVerify){
        setError("Ошибка")
        
        return 
     }
    createUserWithEmailAndPassword(auth, email , password )
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(db)
      // После успешной регистрации добавляем пользователя в Firestore и устанавливаем поле isAdmin в false
      return setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        username:username,
        email: user.email,
        age:age,
        addedPost:0,
        phone:"",
        country:"",
        photo: {
            default:"https://firebasestorage.googleapis.com/v0/b/project-site-c19d5.appspot.com/o/imageUsers%2F%D0%91%D0%B5%D0%B7%D1%8B%D0%BC%D1%8F%D0%BD%D0%BD%D1%8B%D0%B9.png?alt=media&token=c8c285f8-a20d-473d-8b23-62ef1debd27c",
            placed:""  
        },
        isAdmin:false,
        city:"",
        country:"",
        description:"",
        onlineStatuse:"",
        private:"",
        userData: {
            followers: [],
            following: [],
            requests: []
          }

      });
    })
    .then(() => {
      // Очистка формы после успешной регистрации
      setUsername("") ; 
      setEmail("");
      setPassword("");
      setCopypassword("");
      setAge("")
      setError("")
      console.log("Пользователь успешно зарегистрирован");
      window.location.href = "/home"
    })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Ошибка регистрации пользователя:", errorCode, errorMessage);
   setError("Ошибка");
  });
}

useEffect(()=>{
        if(logined){
        // window.location.href = "/home"
    }
    },[logined])

    return (
 <main className={s.megaContainer}>
    <div className={s.megaContent}>
      <form className={s.container} onSubmit={register} ref={animBlock}>
            <div className={s.content1}>{t('signUp')}</div>
            <div className={s.content2}>
                <span className={s.item1}>{t('Username')}</span>
                <span><input ref={userRef} type="name" value={username} pattern="^[a-zA-Z0-9]*$" minLength={4} maxLength={16} name="username" placeholder='Username' onChange={(e)=>{
                    setUsername(e.target.value)
                }}/></span>
            </div>
            <div className={s.content2}>
                <span className={s.item1}>{t('Email')}</span>
                <span><input type="email" value={email}  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" name="email" placeholder='Email' onChange={(e)=>{
                    setEmail(e.target.value)
                }}/></span>
            </div>
            <div className={s.content2}>
                <span className={s.item1}>{t('Password')}</span>
                <span><input type="password" value={password} minLength={8} maxLength={30} name="password" placeholder='Password' onChange={(e)=>{
                    setPassword(e.target.value)
                }}/></span>
            </div>
            <div className={s.content2}>
                <span className={s.item1}>{t('CopyPassword')}</span>
                <span><input ref={rePassRef} type="password" value={copypassword} minLength={8} maxLength={30} name="copypassword" placeholder='Replay password' onChange={(e)=>{
                    setCopypassword(e.target.value)
                }} /></span>
            </div>
            <div className={s.content2}>
                <span className={s.item1}>{t('Age')}</span>
                <span><input type="number" value={age} min="16" max="100" pattern="[1-9][0-9]?|100" name="age" placeholder='Age' onChange={(e)=>{
                    setAge(e.target.value)
                }}/></span>
            </div>
            <div className={s.content3}>
                <input id="box" type="checkbox" />
                <label htmlFor='box' onClick={()=>{
                    setCheckbox((prevCheckbox)=>!prevCheckbox)
                }}>
                    <span>{checkbox ? <MdCheckBox color="whitesmoke" size="17"/> : <MdCheckBoxOutlineBlank size="17" color="white" />}</span>
                </label>
                <span><Link >{t('Rules')}</Link></span>
            </div>
            <div className={s.content4}>
            <span>{t('acctext1')}<Link to="/login">{t('login')}</Link></span>
                    <button type="submit">{t('signUp')}</button>
                    <p style={{color:"red",textAlign:"center"}}>{error}</p>
            </div>

     </form>
        </div>
    </main>
    )
}

export default Registration;