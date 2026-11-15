import {horizonsQuery} from './src/data/destinations.js'

const cache=new Map()
let queue=Promise.resolve()
const ttl=15*60*1000

function lookup(id) {
 const cached=cache.get(id)
 if(cached && Date.now()-cached.started<ttl)return cached.promise
 const promise=queue.then(async()=>{
  const epoch=new Date()
  const jd=epoch.getTime()/86400000+2440587.5
  const url=new URL(horizonsQuery(id,jd,'UT'))
  url.searchParams.set('format','json')
  const response=await fetch(url,{
   headers:{'User-Agent':'ERROR-0/1.0 (+https://github.com/srllamadev/ERROR-0/issues)'},
   signal:AbortSignal.timeout(10000)
  })
  if(!response.ok)throw new Error('Horizons '+response.status)
  const payload=await response.json()
  if(!['1.2','1.3'].includes(payload.signature?.version))throw new Error('Formato de Horizons desconocido')
  const row=payload.result?.match(/\$\$SOE\s*([^\r\n]+)/)?.[1]
  const distance=Number(row?.split(',')[9])
  if(!Number.isFinite(distance)||distance<=0)throw new Error('Distancia inválida de Horizons')
  return {distance,epoch:epoch.toISOString(),query:url.href}
 })
 queue=promise.catch(()=>{})
 cache.set(id,{started:Date.now(),promise})
 return promise
}

export function horizonsMiddleware(req,res,next) {
 const url=new URL(req.url,'http://localhost')
 if(url.pathname!=='/api/horizons-distance')return next()
 const id=url.searchParams.get('planet')
 res.setHeader('Content-Type','application/json')
 if(req.method!=='GET'||!horizonsQuery(id)||!['venus','mars','jupiter','saturn','uranus'].includes(id)){
  res.statusCode=400
  return res.end(JSON.stringify({error:'Destino inválido'}))
 }
 lookup(id).then(data=>res.end(JSON.stringify(data))).catch(()=>{
  res.statusCode=503
  res.end(JSON.stringify({error:'Horizons no disponible'}))
 })
}
