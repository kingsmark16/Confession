export type FlowerKind = 'carnation' | 'mum' | 'pom' | 'rose' | 'sunflower'

export type BouquetFlower = {
  color: 'blush' | 'cream' | 'gold' | 'orange' | 'pink' | 'white'
  delay: number
  id: string
  kind: FlowerKind
  label: string
  scale: number
  stemCurve: number
  x: number
  y: number
}

export type VisitorBud = {
  color: BouquetFlower['color']
  id: number
  isLeaving?: boolean
  lean: number
  x: number
  y: number
}

export const bouquetFlowers: BouquetFlower[] = [
  { color: 'gold', delay: 1.2, id: 'sunflower', kind: 'sunflower', label: 'sunflower', scale: 1.16, stemCurve: 8, x: 298, y: 230 },
  { color: 'gold', delay: 0.55, id: 'gold-pom-left', kind: 'pom', label: 'yellow pom flower', scale: 0.82, stemCurve: -34, x: 190, y: 170 },
  { color: 'white', delay: 0.8, id: 'white-rose', kind: 'rose', label: 'white rose', scale: 0.8, stemCurve: -12, x: 275, y: 142 },
  { color: 'blush', delay: 1, id: 'blush-mum-top', kind: 'mum', label: 'blush chrysanthemum', scale: 0.82, stemCurve: 20, x: 382, y: 158 },
  { color: 'pink', delay: 1.45, id: 'pink-carnation-top', kind: 'carnation', label: 'pink carnation', scale: 0.86, stemCurve: 30, x: 374, y: 232 },
  { color: 'orange', delay: 1.75, id: 'orange-carnation', kind: 'carnation', label: 'orange carnation', scale: 0.72, stemCurve: 44, x: 428, y: 292 },
  { color: 'gold', delay: 1.6, id: 'gold-pom-right', kind: 'pom', label: 'yellow pom flower', scale: 0.8, stemCurve: 52, x: 438, y: 252 },
  { color: 'pink', delay: 1.9, id: 'pink-carnation-left', kind: 'carnation', label: 'magenta carnation', scale: 0.88, stemCurve: -54, x: 198, y: 316 },
  { color: 'cream', delay: 2.1, id: 'cream-rose', kind: 'rose', label: 'cream rose', scale: 0.72, stemCurve: -22, x: 268, y: 350 },
  { color: 'blush', delay: 2.3, id: 'blush-mum-low', kind: 'mum', label: 'blush chrysanthemum', scale: 0.86, stemCurve: 28, x: 372, y: 356 },
]

export const visitorBudColors: VisitorBud['color'][] = ['pink', 'gold', 'blush', 'orange', 'cream']
