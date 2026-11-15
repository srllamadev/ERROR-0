const catalog=[
 ['mars','Marte','Planeta rocoso',198132895.7162174,150,2,'#ff9d74','#a55748','#805b60','0,38 g','−63 °C','Desierto rojizo',[118,101,158]],
 ['venus','Venus','Planeta · atmósfera densa',48717080.69488387,105,1,'#ffdb92','#9e6d3e','#a16c50','0,90 g','465 °C','Llanura volcánica',[447,100,158]],
 ['jupiter','Júpiter','Gigante gaseoso · estación orbital',792700327.419541,165,3,'#ffc7a1','#675959','#825f55','2,53 g','−110 °C','Plataforma de mantenimiento',[120,332,157]],
 ['saturn','Saturno','Gigante gaseoso · estación orbital',1297719374.487818,165,4,'#f2d391','#77706b','#584d54','1,06 g','−140 °C','Plataforma entre anillos',[462,347,131]],
 ['uranus','Urano','Gigante helado · estación orbital',2762499228.718615,170,5,'#99fff4','#588389','#224759','0,89 g','−195 °C','Plataforma criogénica',[781,343,137]],
]
export const destinations=catalog.map(([id,name,kind,distance,fuel,tier,color,ground,sky,gravity,temperature,terrain,crop])=>({
 id,name,kind,distance,fuel,extras:['shield','reserve','antenna','cooling','backup'].slice(0,tier),color,ground,sky,gravity,temperature,terrain,crop
}))
export const formatDistance=value=>new Intl.NumberFormat('es-BO').format(Math.round(value))+' km'
export const horizonsEpoch='14 nov 2026 · 00:00 TDB'
const targetCodes={mars:499,venus:299,jupiter:599,saturn:699,uranus:799}
export function horizonsQuery(id, julianDate=2461358.5,timeScale='TDB') {
 return targetCodes[id] ? 'https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='+targetCodes[id]+'&CENTER=500%40399&EPHEM_TYPE=VECTORS&TLIST='+encodeURIComponent(julianDate)+'&TIME_TYPE='+encodeURIComponent(timeScale)+'&OUT_UNITS=KM-S&VEC_TABLE=3&CSV_FORMAT=YES' : null
}

