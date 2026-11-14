import {create} from 'zustand'
import {parts} from '../data/components'

export const useGameStore = create(set => ({
  screen:'home', panel:null, near:null, selected:false, ids:[], validated:false, reviewed:false, elapsed:0, risky:false,
  set,
  toggle:id=>set(s=>{
    const group=parts.find(part=>part.id===id).group
    const kept=s.ids.filter(item=>item!==id && (group==='instrument' || parts.find(part=>part.id===item).group!==group))
    return {ids:s.ids.includes(id)?kept:[...kept,id],validated:false,reviewed:false}
  })
}))
