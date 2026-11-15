export const deck={halfWidth:18.9,back:-6,front:5,divider:6.3,doorCenter:.55,doorWidth:2.25}
export const flightStations=[
 {id:'engineering',name:'Ingeniería',x:-12.6,z:-3.6},
 {id:'oxygen',name:'Almacén · Brecha del casco',x:0,z:-3.6},
 {id:'navigation',name:'Cabina',x:12.6,z:-3.6}
]
export function canWalkDeck(x,z){
 const r=.32
 if(Math.abs(x)>deck.halfWidth-r||z<deck.back+r||z>deck.front-r)return false
 const inDoor=Math.abs(z-deck.doorCenter)<deck.doorWidth/2-r
 if(!inDoor && z<3.15+r && Math.abs(Math.abs(x)-deck.divider)<r+.14)return false
 return flightStations.every(station=>Math.abs(x-station.x)>1.35||Math.abs(z-station.z)>.98)
}

