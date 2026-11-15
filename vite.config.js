import {defineConfig} from 'vite'
import {horizonsMiddleware} from './horizons-server.js'

export default defineConfig({
 plugins:[{
  name:'horizons-distance',
  configureServer(server){server.middlewares.use(horizonsMiddleware)},
  configurePreviewServer(server){server.middlewares.use(horizonsMiddleware)}
 }]
})
