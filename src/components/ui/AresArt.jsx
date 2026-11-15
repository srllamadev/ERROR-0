import React,{useEffect,useState} from 'react'

import {cuts,mounts,shipSheet,sheetSize} from '../spaceship/shipSprites'

export function PartArt({id,...props}) {
 return <svg viewBox={cuts[id].join(' ')} aria-hidden="true" {...props}>
  <image href={shipSheet} width={sheetSize[0]} height={sheetSize[1]}/>
 </svg>
}
export function AssemblyArt({ids,onToggle,stock,labels}) {
 return <div className="assembly-art hologram ship-sprite-assembly" aria-label="Vista de ensamblaje">
  <svg viewBox="0 0 400 260" role="group" aria-label="Módulos de la nave">
   {mounts.map(([module,id,x,y,w])=>{
    const [,,sw,sh]=cuts[id]
    const label=labels.find(item=>item.id===module)
    if(!label) return null
    return <g key={id} opacity={ids.includes(module)?1:.22}>
     <PartArt id={id} x={x} y={y} width={w} height={w*sh/sw}/>
     {id===module && <rect x={x} y={y} width={w} height={w*sh/sw} fill="transparent" role="button"
      tabIndex={stock.includes(module)?0:-1} aria-disabled={!stock.includes(module)}
      aria-pressed={ids.includes(module)} aria-label={label.part} onClick={()=>onToggle(module)}
      onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onToggle(module)}}}/>}
    </g>
   })}
  </svg>
 </div>
}
export function PlanetLaunch({destination,onContinue,failure,onRetry}) {
 const [elapsed,setElapsed]=useState(0)
 useEffect(()=>{
  const start=performance.now()
  const timer=setInterval(()=>{
   const time=Math.min(8,(performance.now()-start)/1000)
   setElapsed(time)
   if(time===8) clearInterval(timer)
  },80)
  return ()=>clearInterval(timer)
 },[])
 const result=elapsed>=8
 return <section className={failure?'launch-film failed-launch':'launch-film'} aria-live="polite">
  <div className="launch-horizon" style={{background:`radial-gradient(ellipse at top,${destination.color},${destination.ground},#131221)`}}/>
  <div className="launch-capsule"><svg viewBox="0 0 100 112" aria-hidden="true"><path d="M50 8 66 36 66 70 84 90H16L34 70V36Z" fill="#c6ecff" stroke="#62eaff" strokeWidth="2"/><circle cx="50" cy="39" r="8" fill="#142e56"/><path className="launch-exhaust" d="M39 90H61L50 110Z" fill="#52f4ff"/></svg></div>
  <div className="launch-flash" aria-hidden="true"/><div className="launch-caption"><span className="kicker">ARES-IV · {destination.name}</span>
   <h2>{result?(failure?'Nave destruida':'Nivel completado'):elapsed<3?'Despegue en '+Math.ceil(3-elapsed):elapsed<4?'Ignición':failure?'Pérdida de la nave':'Salida de la zona'}</h2>
   {result&&failure&&<><p>{failure}</p><button className="primary" onClick={onRetry}>Volver al taller</button></>}{result&&!failure&&<><p>La tripulación ha despegado desde {destination.name}.</p><button className="primary" onClick={onContinue}>Continuar al Nivel 2</button></>}
  </div>
 </section>
}





