import React, { useState, useRef ,useContext ,useEffect } from 'react';
import s from './MusicPlayer.module.scss'
import { MyContext } from './../../context/Context';
import { FaPlayCircle,FaPauseCircle } from "react-icons/fa";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
     const song = useRef(new Audio())

  const {srcMusicId,setSrcMusicId} = useContext(MyContext);


useEffect(()=>{
    if(srcMusicId){
        song.current.src = srcMusicId;
        song.current.play()
        setIsPlaying(true)
    } else {
        song.current.src = null
        song.current.pause()
        setIsPlaying(false)
    }
},[srcMusicId,setSrcMusicId])

  const togglePlayPause = () => {
    if (isPlaying) {
      song.current.pause();
    } else {
      song.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(song.current.currentTime);
  };

  const handleLoadedData = () => {
    setDuration(song.current.duration);
  };

  const handleProgressChange = (e) => {
    const time = (e.target.value / 100) * duration;
    song.current.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <div className={s.megaContainer}>
      <audio
        ref={song}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        src={srcMusicId}
      />

      <div className={s.controls}>
        <button onClick={togglePlayPause} className={s.btn}>
          {isPlaying ? <FaPauseCircle/> : <FaPlayCircle/>}
        </button>

        <div className={s.progressBar}>
          <input
            type="range"
            min="0"
            max="100"
            value={(currentTime / duration) * 100 || 0}
            onChange={handleProgressChange}
          />
        </div>

        <span className={s.time}>
          {Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)} : {Math.floor(duration / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}
        </span>
      </div>
    </div>
  );
};

export default MusicPlayer;