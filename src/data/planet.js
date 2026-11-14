export const field={x:28,z:23}
export const zones=[
 {id:'frame',name:'Lugar del accidente',part:'Estructura principal',x:-9,z:8,color:'#ffab66'},
 {id:'engine',name:'Cohete destruido A',part:'Motor',x:-21,z:-10,color:'#ff897a'},
 {id:'tank',name:'Cohete destruido B',part:'Tanque de combustible',x:18,z:-13,color:'#ffcc74'},
 {id:'power',name:'Puesto de energía',part:'Sistema eléctrico',x:-15,z:17,color:'#8de4ff'},
 {id:'navigation',name:'Depósito de navegación',part:'Computadora de navegación',x:22,z:13,color:'#9df5ba'},
 {id:'reserve',name:'Depósito de combustible',part:'Tanque auxiliar',x:4,z:-14,color:'#f5af71',extra:true},
 {id:'shield',name:'Restos del escudo',part:'Escudo térmico',x:16,z:17,color:'#e8a9ff',extra:true}
]
export const rocks=[
 [-26,-17,2.6],[-17,-20,3.3],[-8,-19,2.9],[2,-21,3.5],[10,-21,2.6],[24,-19,3.3],
 [-25,2,2.5],[-25,14,2.7],[-8,21,2.8],[2,20,3.2],[13,21,2.6],[26,20,2.3],
 [-12,-6,2.4],[-8,-11,1.6],[9,-5,2.8],[13,-2,1.4],[12,8,2.4],[-8,14,1.4]
]
export function canWalk(x,z,r=.42) {
 return Math.abs(x)<=field.x-r && Math.abs(z)<=field.z-r &&
   rocks.every(([a,b,size])=>Math.hypot(x-a,z-b)>size+r) &&
   zones.every(zone=>Math.hypot(x-zone.x,z-zone.z)>1.65+r)
}
export const pickupPosition=zone=>[zone.x,zone.z+2.85]


