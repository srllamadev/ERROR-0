export const destinations = [
 {id:'moon', name:'Luna', kind:'Satélite · destino original', distance:420000, fuel:90, extras:[], color:'#aed7ec'},
 {id:'mars', name:'Marte', kind:'Planeta · ruta interplanetaria', distance:68000000, fuel:150, extras:['reserve'], color:'#ff9d74'},
 {id:'venus', name:'Venus', kind:'Planeta · ruta de alta exposición solar', distance:112000000, fuel:150, extras:['reserve','shield'], color:'#ffdb92'}
]
export const formatDistance=value=>new Intl.NumberFormat('es-BO').format(value)+' km'
