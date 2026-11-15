import React,{useRef,useState} from 'react'

const points=[[10,75],[30,42],[49,22],[68,60],[88,38]]
export default function CourseChart({canConfirm,onConfirm}) {
 const [step,setStep]=useState(0)
 const [tip,setTip]=useState(null)
 const [message,setMessage]=useState('')
 const board=useRef()
 const drag=useRef(null)
 const current=useRef(0)

 function reach(index){
  if(index!==current.current+1){setMessage('Sigue el siguiente punto iluminado.');return}
  current.current=index
  setStep(index)
  setMessage('')
 }
 function move(event){
  if(drag.current!==event.pointerId)return
  const bounds=board.current.getBoundingClientRect()
  const x=(event.clientX-bounds.left)/bounds.width*100
  const y=(event.clientY-bounds.top)/bounds.height*100
  setTip([x,y])
  const target=points[current.current+1]
  if(target&&Math.hypot((x-target[0])*bounds.width/100,(y-target[1])*bounds.height/100)<24)reach(current.current+1)
 }
 function stop(){drag.current=null;setTip(null)}

 return <div className="course-chart">
  <p>Arrastra la nave por los puntos en orden hasta la Tierra. También puedes seleccionar cada punto numerado.</p>
  <div className="course-board" ref={board}>
   <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <polyline points={points.map(p=>p.join(',')).join(' ')} fill="none" stroke="#8ac2db" strokeDasharray="3 5" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
    <polyline points={[...points.slice(0,step+1),...(tip?[tip]:[])].map(p=>p.join(',')).join(' ')} fill="none" stroke="#78f7d1" strokeWidth="3" vectorEffect="non-scaling-stroke"/>
   </svg>
   {points.slice(1).map(([x,y],i)=><button type="button" key={i} className={'course-node '+(i+1===step+1?'next':'')} style={{left:x+'%',top:y+'%'}} disabled={i+1<=step} aria-label={i===3?'Destino Tierra':'Punto '+(i+1)} onClick={()=>reach(i+1)}>{i===3?'⊕':i+1}</button>)}
   <button type="button" className="course-ship" aria-label="Nave" style={{left:(tip??points[step])[0]+'%',top:(tip??points[step])[1]+'%'}}
    onPointerDown={event=>{if(event.button!==0)return;event.currentTarget.setPointerCapture(event.pointerId);drag.current=event.pointerId}}
    onPointerMove={move} onPointerUp={event=>{move(event);stop()}} onLostPointerCapture={stop}>➤</button>
  </div>
  <p role="status">{step===4?'Ruta trazada hasta la Tierra.':step+' / 4 puntos alcanzados. '+message}</p>
  <button className="primary" disabled={step!==4||!canConfirm} onClick={onConfirm}>Ejecutar maniobra · 20 kg</button>
 </div>
}
