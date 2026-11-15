import React,{useRef,useState} from 'react'

export default function HullPatch({onSeal}) {
 const board=useRef()
 const drag=useRef(null)
 const [point,setPoint]=useState(null)
 const [selected,setSelected]=useState(false)
 const [miss,setMiss]=useState(false)
 function locate(event){
  const bounds=board.current.getBoundingClientRect()
  return {x:(event.clientX-bounds.left)/bounds.width*100,y:(event.clientY-bounds.top)/bounds.height*100}
 }
 function release(event){
  if(drag.current!==event.pointerId)return
  const {x,y}=locate(event)
  drag.current=null
  setPoint(null)
  if(Math.abs(x-73)<=10&&Math.abs(y-50)<=17)onSeal()
  else setMiss(true)
 }
 return <>
  <p>Arrastra el parche sobre la grieta. Con el teclado, selecciona el parche y luego el área dañada.</p>
  <div className="hull-board" ref={board}>
   <button type="button" className="hull-crack" aria-label="Área dañada" disabled={!selected} onClick={onSeal}>ϟ</button>
   <button type="button" className="hull-patch" aria-label="Parche de emergencia" aria-pressed={selected}
    style={point?{left:point.x+'%',top:point.y+'%'}:undefined}
    onClick={event=>{if(event.detail===0)setSelected(value=>!value)}}
    onPointerDown={event=>{
     if(event.button!==0||drag.current!==null)return
     event.currentTarget.setPointerCapture(event.pointerId)
     drag.current=event.pointerId
     setSelected(false)
     setMiss(false)
     setPoint(locate(event))
    }}
    onPointerMove={event=>{if(drag.current===event.pointerId)setPoint(locate(event))}}
    onPointerUp={release} onLostPointerCapture={()=>{drag.current=null;setPoint(null)}}>▦</button>
  </div>
  {miss&&<p role="status">El parche debe cubrir la grieta marcada. Intenta nuevamente.</p>}
 </>
}
