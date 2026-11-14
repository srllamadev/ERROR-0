const catalog=[
 ['moon','Luna','Satélite · destino original',420000,90,0,'#b7c2d6','#777984','#1b2038','0,16 g','−20 °C','Regolito y cráteres',[770,102,157]],
 ['earth','Tierra','Planeta · retorno',1400000,90,0,'#8fded1','#407256','#366987','1,00 g','15 °C','Valles y vegetación',[1094,101,158]],
 ['x9','Asteroide X-9','Asteroide · base minera',8200000,90,0,'#b9a596','#716053','#242235','0,05 g','−150 °C','Roca minera',[772,565,150]],
 ['mars','Marte','Planeta rocoso',68000000,150,1,'#ff9d74','#a55748','#805b60','0,38 g','−63 °C','Desierto rojizo',[118,101,158]],
 ['venus','Venus','Planeta · atmósfera densa',112000000,150,2,'#ffdb92','#9e6d3e','#a16c50','0,90 g','465 °C','Llanura volcánica',[447,100,158]],
 ['cristalia','Cristalia','Mundo ficticio',220000000,150,1,'#df9cff','#634879','#40265d','0,65 g','−80 °C','Yacimientos cristalinos',[1093,337,158]],
 ['oceanus','Océanus','Mundo ficticio',410000000,150,1,'#72dcff','#32778b','#174c76','0,82 g','12 °C','Arrecife y costa',[699,565,153]],
 ['jupiter','Júpiter','Gigante gaseoso · estación orbital',720000000,165,2,'#ffc7a1','#675959','#825f55','2,53 g','−110 °C','Plataforma de mantenimiento',[120,332,157]],
 ['saturn','Saturno','Gigante gaseoso · estación orbital',1300000000,165,2,'#f2d391','#77706b','#584d54','1,06 g','−140 °C','Plataforma entre anillos',[462,347,131]],
 ['uranus','Urano','Gigante helado · estación orbital',2700000000,170,2,'#99fff4','#588389','#224759','0,89 g','−195 °C','Plataforma criogénica',[781,343,137]],
 ['binary','Binaria','Mundo ficticio · dos soles',3800000000,175,2,'#ffaa73','#98563c','#61364b','1,15 g','42 °C','Desierto de doble iluminación',[130,575,132]]
]
export const destinations=catalog.map(([id,name,kind,distance,fuel,tier,color,ground,sky,gravity,temperature,terrain,crop])=>({
 id,name,kind,distance,fuel,extras:['reserve','shield'].slice(0,tier),color,ground,sky,gravity,temperature,terrain,crop
}))
export const formatDistance=value=>new Intl.NumberFormat('es-BO').format(value)+' km'
