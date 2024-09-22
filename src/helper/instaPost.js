import {useLayoutEffect,useContext} from 'react'
import { MyContext } from './../context/Context';



export const InstagramEmbedLoader = () => {


  useLayoutEffect(() => {
   
    if (window.instgrm) {
      window.instgrm.Embeds.process();
     
    }


  }, []);

  return null;
};