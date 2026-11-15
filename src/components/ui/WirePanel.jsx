import React,{useState} from 'react'

const terminals=[
 {symbol:'○',name:'Círculo',color:'#f4c650'},
 {symbol:'△',name:'Triángulo',color:'#ff7669'},
 {symbol:'★',name:'Estrella',color:'#e38bee'},
 {symbol:'×',name:'Cruz',color:'#7cbcff'}
]
const destinations=[1,3,0,2]
const row=i=>12.5+i*25

export default function WirePanel({isolated,links,onIsolate,onConnect,onRestore}) {
 const [selected,setSelected]=useState(null)
 const [message,setMessage]=useState('')
 function connect(id){
  if(selected===null)return
  if(id!==selected){setMessage('Conector incompatible. Busca el mismo símbolo.');return}
  onConnect(id)
  setSelected(null)
  setMessage('Conexión verificada.')
 }
 return <div className="wire-repair">
  <p><b>Falla detectada:</b> cortocircuito en el ramal principal.</p>
  {!isolated?<button className="primary" onClick={onIsolate}>Aislar ramal averiado</button>:<>
   <p>Ramal aislado. Selecciona un extremo y conecta su par del mismo símbolo en el ramal de respaldo.</p>
   <div className="wire-board">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{links.map(id=><path key={id} d={`M 12 ${row(id)} C 43 ${row(id)}, 57 ${row(destinations.indexOf(id))}, 88 ${row(destinations.indexOf(id))}`} fill="none" stroke={terminals[id].color} strokeWidth="4" vectorEffect="non-scaling-stroke"/>)}</svg>
    {[terminals.map((_,id)=>id),destinations].map((side,column)=><div className="wire-column" key={column}>{side.map(id=><button type="button" key={id}
     style={{'--wire':terminals[id].color}} aria-label={(column?'Destino ':'Origen ')+terminals[id].name} aria-pressed={column?undefined:selected===id}
     disabled={links.includes(id)||(column===1&&selected===null)} onClick={()=>column?connect(id):setSelected(id)}>{terminals[id].symbol}</button>)}</div>)}
   </div>
   <p role="status">{links.length} / 4 conexiones verificadas. {message}</p>
   <button className="primary" disabled={links.length!==4} onClick={onRestore}>Restablecer distribución</button>
  </>}
  <p className="fine">Simulación didáctica de detección, aislamiento y transferencia de carga. <a href="https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/#3.6" target="_blank" rel="noreferrer">NASA · Gestión y distribución de energía (PMAD)</a></p>
 </div>
}
