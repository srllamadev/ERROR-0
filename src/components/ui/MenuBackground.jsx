import React,{useEffect,useRef,useState} from 'react'

export default function MenuBackground() {
 const video=useRef(null)
 const [blocked,setBlocked]=useState(false)

 async function play() {
  const element=video.current
  if(!element)return
  element.muted=true
  try {
   await element.play()
  } catch(error) {
   if(error.name!=='AbortError' && video.current===element)setBlocked(true)
  }
 }

 useEffect(()=>{void play()},[])

 return <>
  <video ref={video} className="ares-menu-video" autoPlay loop muted playsInline preload="auto" aria-hidden="true"
   onPlaying={()=>setBlocked(false)}
   src={import.meta.env.BASE_URL+'mission-menu.mp4'} poster={import.meta.env.BASE_URL+'mission-menu.png'}/>
  {blocked&&<button className="ares-video-play" onClick={play}>Activar fondo animado</button>}
 </>
}
