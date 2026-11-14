import React,{Component,Suspense} from 'react'
export default class GameCanvas extends Component {
 state={failed:false}
 static getDerivedStateFromError(){return {failed:true}}
 render(){
  if (this.state.failed) return <div className="canvas-message">No se pudo iniciar la escena 3D. Verifica que WebGL esté disponible y recarga el juego.</div>
  return <Suspense fallback={<div className="canvas-message">Cargando escena 3D…</div>}>{this.props.children}</Suspense>
 }
}
