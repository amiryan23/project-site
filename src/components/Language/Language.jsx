import s from './Language.module.scss'
import React,{ useState,useCallback,useEffect,useContext } from 'react'
import { useTranslation } from 'react-i18next';
import { FaAngleDown,FaGripLines } from "react-icons/fa";
import { IoCheckmarkDoneSharp } from "react-icons/io5";



const Language = () => {

	const languageStorage = JSON.parse(localStorage.getItem('language'))
    const [language,setLanguage] = useState("English")
	const [activeLanguage,setActiveLanguage] = useState(languageStorage ? languageStorage : "en")
    const [open,setOpen] = useState(false)


	useEffect(()=>{
changeTranslate(languageStorage)

if(languageStorage && languageStorage === "en" || activeLanguage === "en"){
    changeLanguage("English")
} else if(languageStorage && languageStorage === "ru" || activeLanguage === "ru") {
    changeLanguage("Русский")
} else if (languageStorage && languageStorage === "am" || activeLanguage === "am") {
    changeLanguage("Հայերեն")
}

},[])


	  const changeLanguage = (lang) => {
        setLanguage(lang)
        setOpen(false)
    }

    const { i18n } = useTranslation();

  const changeTranslate = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem('language',`"${lng}"`)
};



	return (
		<>
		<span className={s.miniBlock1} onMouseLeave={()=>{setOpen(false)}}>
                    <span onClick={()=>{setOpen((prevOpen)=> !prevOpen)}} className={s.block1}>{language}{open ? <FaGripLines /> :<FaAngleDown />}</span>
                    {open ? <span className={s.block2}>
                        <span onClick={()=>{
                            changeLanguage("English")
                            changeTranslate("en")
                        }} className={language === "English" ? s.activeLanguage : s.miniItem1}>English{language === "English" ? <IoCheckmarkDoneSharp /> : ""}</span>
                        <span onClick={()=>{
                            changeLanguage("Русский")
                            changeTranslate("ru")
                        }} className={language === "Русский" ? s.activeLanguage : s.miniItem1}>Русский{language === "Русский" ? <IoCheckmarkDoneSharp /> : ""}</span>
                        <span onClick={()=>{
                            changeLanguage("Հայերեն")
                            changeTranslate("am")
                        }} className={language === "Հայերեն" ? s.activeLanguage : s.miniItem1}>Հայերեն{language === "Հայերեն" ? <IoCheckmarkDoneSharp /> : ""}</span>
                    </span>
                    : "" }
        </span>
		</>
		)
}


export default Language