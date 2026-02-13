export type FlowerSpecies = 'rose' | 'tulip' | 'cherry' | 'daisy' | 'lavender' | 'sunflower'

export type GardenFlower = {
  delay: number
  duration: number
  id: string
  isLeaving?: boolean
  scale: number
  species: FlowerSpecies
  x: number
  y: number
}
