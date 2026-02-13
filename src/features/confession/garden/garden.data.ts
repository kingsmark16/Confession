import type { FlowerSpecies, GardenFlower } from './garden.types'

export const flowerSpecies: FlowerSpecies[] = ['rose', 'tulip', 'cherry', 'daisy', 'lavender', 'sunflower']

export const flowerSpeciesLabels: Record<FlowerSpecies, string> = {
  cherry: 'cherry blossom',
  daisy: 'daisy',
  lavender: 'lavender',
  rose: 'rose',
  sunflower: 'sunflower',
  tulip: 'tulip',
}

export const flowerPetalCounts: Record<FlowerSpecies, number> = {
  cherry: 5,
  daisy: 10,
  lavender: 8,
  rose: 9,
  sunflower: 12,
  tulip: 4,
}

const growthDurations: Record<FlowerSpecies, number> = {
  cherry: 5.8,
  daisy: 4.8,
  lavender: 6.4,
  rose: 7.2,
  sunflower: 6.8,
  tulip: 5.4,
}

const initialPositions = [6, 14, 23, 31, 40, 49, 58, 67, 75, 83, 91, 97]

export const initialGardenFlowers: GardenFlower[] = initialPositions.map((x, index) => {
  const species = flowerSpecies[index % flowerSpecies.length]
  return {
    delay: index * 0.32,
    duration: growthDurations[species],
    id: `garden-flower-${index}`,
    scale: 0.72 + ((index * 7) % 5) * 0.09,
    species,
    x,
    y: 3 + (index % 3) * 1.5,
  }
})

export function createGardenFlower(id: string, x: number, sequence: number): GardenFlower {
  const species = flowerSpecies[sequence % flowerSpecies.length]
  return {
    delay: 0,
    duration: growthDurations[species],
    id,
    scale: 0.76 + (sequence % 5) * 0.08,
    species,
    x: Math.min(96, Math.max(4, x)),
    y: 3 + (sequence % 4) * 1.2,
  }
}
