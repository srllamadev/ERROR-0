export const limits = {cost:550, mass:850}
export const categories = [
  ['launcher','1. Lanzador'], ['power','2. Generación eléctrica'],
  ['comms','3. Comunicaciones'], ['instrument','4. Instrumentos'], ['reserve','5. Reserva eléctrica']
]
export const parts = [
  {id:'small', group:'launcher', name:'Lanzador ligero', capacity:850, cost:85, role:'Capacidad de 850 kg'},
  {id:'medium', group:'launcher', name:'Lanzador mediano', capacity:2200, cost:160, role:'Capacidad de 2200 kg'},
  {id:'heavy', group:'launcher', name:'Lanzador pesado', capacity:4800, cost:310, role:'Capacidad de 4800 kg'},
  {id:'solar_std', group:'power', name:'Paneles de silicio', mass:140, cost:45, power:650, role:'Generación solar'},
  {id:'solar_adv', group:'power', name:'Paneles multijunción', mass:210, cost:110, power:1350, role:'Generación solar'},
  {id:'rtg', group:'power', name:'Generador de radioisótopos', mass:290, cost:210, power:520, role:'Generación continua'},
  {id:'sband', group:'comms', name:'Antena banda S', data:120, power:-45, mass:35, cost:25, role:'Enlace omnidireccional'},
  {id:'xband', group:'comms', name:'Antena banda X', data:850, power:-110, mass:95, cost:70, role:'Enlace de alta ganancia'},
  {id:'optical', group:'comms', name:'Terminal óptica', data:3200, power:-185, mass:130, cost:145, role:'Enlace láser'},
  {id:'camera', group:'instrument', name:'Cámara multiespectral', mass:180, power:-95, cost:65, data:280, science:75, role:'Imágenes de la superficie'},
  {id:'radar', group:'instrument', name:'Radar de subsuelo', mass:260, power:-160, cost:90, data:340, science:95, role:'Sondeo de capas subterráneas'},
  {id:'atmo', group:'instrument', name:'Espectrómetro de masas', mass:145, power:-85, cost:75, data:150, science:85, role:'Análisis de gases e isótopos'},
  {id:'magnetometer', group:'instrument', name:'Magnetómetro', mass:65, power:-30, cost:40, data:60, science:70, role:'Medición del campo magnético'},
  {id:'laser', group:'instrument', name:'Espectrómetro láser', mass:210, power:-140, cost:85, data:190, science:80, role:'Análisis elemental'},
  {id:'drill', group:'instrument', name:'Perforador de muestras', mass:480, power:-240, cost:150, data:120, science:0, role:'Requiere operar en la superficie'},
  {id:'battery', group:'reserve', name:'Batería de eclipse', mass:45, cost:10, role:'Reserva para el eclipse'}
]

