const catalog=[
 ['moon','Luna','Satélite · destino original',405584.4175194661,90,0,'#b7c2d6','#777984','#1b2038','0,16 g','−20 °C','Regolito y cráteres',[770,102,157]],
 ['earth','Tierra','Planeta · retorno',0,90,0,'#8fded1','#407256','#366987','1,00 g','15 °C','Valles y vegetación',[1094,101,158]],
 ['mars','Marte','Planeta rocoso',198132895.7162174,150,1,'#ff9d74','#a55748','#805b60','0,38 g','−63 °C','Desierto rojizo',[118,101,158]],
 ['venus','Venus','Planeta · atmósfera densa',48717080.69488387,150,2,'#ffdb92','#9e6d3e','#a16c50','0,90 g','465 °C','Llanura volcánica',[447,100,158]],
 ['jupiter','Júpiter','Gigante gaseoso · estación orbital',792700327.419541,165,2,'#ffc7a1','#675959','#825f55','2,53 g','−110 °C','Plataforma de mantenimiento',[120,332,157]],
 ['saturn','Saturno','Gigante gaseoso · estación orbital',1297719374.487818,165,2,'#f2d391','#77706b','#584d54','1,06 g','−140 °C','Plataforma entre anillos',[462,347,131]],
 ['uranus','Urano','Gigante helado · estación orbital',2762499228.718615,170,2,'#99fff4','#588389','#224759','0,89 g','−195 °C','Plataforma criogénica',[781,343,137]],
]
export const destinations=catalog.map(([id,name,kind,distance,fuel,tier,color,ground,sky,gravity,temperature,terrain,crop])=>({
 id,name,kind,distance,fuel,extras:['reserve','shield'].slice(0,tier),color,ground,sky,gravity,temperature,terrain,crop
}))
export const formatDistance=value=>new Intl.NumberFormat('es-BO').format(Math.round(value))+' km'
export const horizonsEpoch='14 nov 2026 · 00:00 TDB'
const targetCodes={moon:301,mars:499,venus:299,jupiter:599,saturn:699,uranus:799}
export function horizonsQuery(id) {
 return targetCodes[id] ? 'https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='+targetCodes[id]+'&CENTER=500%40399&EPHEM_TYPE=VECTORS&TLIST=2461358.5&OUT_UNITS=KM-S&VEC_TABLE=3&CSV_FORMAT=YES' : null
}
