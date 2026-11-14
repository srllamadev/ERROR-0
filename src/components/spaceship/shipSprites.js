export const sheetSize=[1216,873]
export const shipSheet=import.meta.env.BASE_URL+'ship-sprites.png'
export const cuts={
 frame:[67,175,142,118], body:[74,307,198,134], wing:[40,590,281,96], tail:[61,732,148,105],
 engine:[450,486,327,145],tank:[496,54,221,99],power:[805,77,188,120],
 navigation:[836,296,134,197],reserve:[1058,318,88,169],shield:[71,46,138,102],burnt:[1065,624,77,153],ruptured:[1058,318,88,169]
}
// Coordinates in the assembled ship's 400 × 260 view.
export const mounts=[
 ['frame','tail',277,28,86],['frame','wing',105,126,209],
 ['engine','engine',277,99,117],['frame','body',133,65,181],
 ['frame','frame',48,111,125],['tank','tank',139,152,132],
 ['power','power',212,183,79],['navigation','navigation',88,178,48],
 ['reserve','reserve',296,158,43],['shield','shield',56,106,88],['burnt','burnt',268,176,31],['ruptured','ruptured',339,152,39]
]

