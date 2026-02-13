import type { CSSProperties } from 'react'
import { flowerPetalCounts } from './garden.data'
import type { GardenFlower } from './garden.types'
import { useRomanticGarden } from './useRomanticGarden'

const grassBlades = Array.from({ length: 44 })
const blossomClusters = Array.from({ length: 12 })
const pollenParticles = Array.from({ length: 22 })
const fallingPetals = Array.from({ length: 16 })
const fallingLeaves = Array.from({ length: 10 })
const fireflies = Array.from({ length: 14 })
const bokehLights = Array.from({ length: 10 })
const distantBirds = Array.from({ length: 5 })
const floatingHearts = Array.from({ length: 7 })

function indexedStyle(index: number) {
  return {
    '--item-delay': `${(index * 0.47) % 6}s`,
    '--item-index': index,
    '--item-left': `${((index * 37) % 96) + 2}%`,
    '--item-scale': 0.62 + (index % 5) * 0.12,
    '--item-speed': `${7 + (index % 6) * 1.7}s`,
    '--item-top': `${((index * 53) % 72) + 8}%`,
    '--item-turn': `${(index % 2 === 0 ? 1 : -1) * (8 + index % 12)}deg`,
  } as CSSProperties
}

function Flower({ flower }: { flower: GardenFlower }) {
  const petalCount = flowerPetalCounts[flower.species]
  const style = {
    '--flower-bud-delay': `${flower.delay + flower.duration * 0.48}s`,
    '--flower-bud-duration': `${flower.duration * 0.38}s`,
    '--flower-delay': `${flower.delay}s`,
    '--flower-bloom-delay': `${flower.delay + flower.duration * 0.62}s`,
    '--flower-duration': `${flower.duration}s`,
    '--flower-leaf-delay': `${flower.delay + flower.duration * 0.38}s`,
    '--flower-scale': flower.scale,
    '--flower-x': `${flower.x}%`,
    '--flower-y': `${flower.y}%`,
  } as CSSProperties

  return (
    <span className={`garden-flower flower-${flower.species} ${flower.isLeaving ? 'is-leaving' : ''}`} style={style}>
      <span className="flower-sway">
        <span className="flower-seed" />
        <span className="flower-growth">
          <span className="flower-stem"><span className="flower-dew" /></span>
          <span className="flower-leaf flower-leaf-left" />
          <span className="flower-leaf flower-leaf-right" />
          <span className="flower-bud" />
          <span className="flower-bloom">
            {Array.from({ length: petalCount }, (_, index) => (
              <span
                className="flower-petal"
                key={index}
                style={{
                  '--petal-angle': `${index * (360 / petalCount)}deg`,
                  '--petal-delay': `${flower.delay + flower.duration * 0.62 + index * 0.07}s`,
                } as CSSProperties}
              />
            ))}
            <span className="flower-center" />
          </span>
        </span>
      </span>
    </span>
  )
}

function CherryTree({ side }: { side: 'left' | 'right' }) {
  return (
    <span className={`garden-tree garden-tree-${side}`}>
      <span className="tree-trunk" />
      <span className="tree-branch tree-branch-one" />
      <span className="tree-branch tree-branch-two" />
      <span className="tree-canopy">
        {blossomClusters.map((_, index) => <span className="tree-blossom" key={index} style={indexedStyle(index)} />)}
      </span>
    </span>
  )
}

export function RomanticGarden() {
  const { announcement, flowers, growFlower, handlePointerLeave, handlePointerMove, stageRef } = useRomanticGarden()

  return (
    <div className="garden-experience">
      <h2 className="sr-only" id="garden-title">Our love is growing</h2>
      <p className="sr-only" id="garden-instructions">A romantic animated spring garden. Activate anywhere in the scene to grow another flower.</p>
      <p aria-live="polite" className="sr-only">{announcement}</p>
      <button
        aria-describedby="garden-instructions"
        aria-label="I am so happy you chose me, and I will love you always. Our love story starts now, and I am so excited. Grow another flower in our romantic garden"
        autoFocus
        className="romantic-garden"
        onClick={growFlower}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        ref={stageRef}
        type="button"
      >
        <span aria-hidden="true" className="garden-world">
          <span className="garden-sky" />
          <span className="garden-sun" />
          <span className="garden-rays" />
          <span className="garden-lens-flare" />

          <span className="garden-cloud cloud-one" />
          <span className="garden-cloud cloud-two" />
          <span className="garden-cloud cloud-three" />

          <span className="garden-birds">
            {distantBirds.map((_, index) => <span className="garden-bird" key={index} style={indexedStyle(index)} />)}
          </span>

          <span className="garden-hill garden-hill-far" />
          <span className="garden-hill garden-hill-middle" />
          <span className="garden-hill garden-hill-near" />
          <CherryTree side="left" />
          <CherryTree side="right" />
          <span className="garden-fog" />

          <span className="garden-bokeh">
            {bokehLights.map((_, index) => <span key={index} style={indexedStyle(index)} />)}
          </span>

          <span className="garden-grass">
            {grassBlades.map((_, index) => <span key={index} style={indexedStyle(index)} />)}
          </span>

          <span className="garden-flower-bed">
            {flowers.map((flower) => <Flower flower={flower} key={flower.id} />)}
          </span>

          <span className="garden-butterflies">
            {Array.from({ length: 4 }, (_, index) => (
              <span className={`butterfly-path butterfly-path-${index + 1}`} key={index}>
                <span className="butterfly"><span className="butterfly-wing butterfly-wing-left" /><span className="butterfly-body" /><span className="butterfly-wing butterfly-wing-right" /></span>
              </span>
            ))}
          </span>

          <span className="garden-bees">
            {Array.from({ length: 3 }, (_, index) => (
              <span className={`bee-path bee-path-${index + 1}`} key={index}><span className="garden-bee"><span className="bee-wing" /></span></span>
            ))}
          </span>

          <span className="garden-petals">
            {fallingPetals.map((_, index) => <span key={index} style={indexedStyle(index)} />)}
          </span>
          <span className="garden-leaves">
            {fallingLeaves.map((_, index) => <span key={index} style={indexedStyle(index + 3)} />)}
          </span>
          <span className="garden-pollen">
            {pollenParticles.map((_, index) => <span key={index} style={indexedStyle(index)} />)}
          </span>
          <span className="garden-fireflies">
            {fireflies.map((_, index) => <span key={index} style={indexedStyle(index)} />)}
          </span>
          <span className="garden-hearts">
            {floatingHearts.map((_, index) => <span key={index} style={indexedStyle(index)} />)}
          </span>
        </span>

        <span aria-hidden="true" className="garden-for-you">This is for you</span>

        <span className="garden-love-note">
          <span>WHOOOAAAA!!!, NO REFUNDS, NO EXCHANGES HAHAHA</span>
          <strong>I AM SO HAPPY YOU GAVE ME A CHANCE! </strong>
          <span className="garden-celebration">MAGNONOTIFY TO SAKIN!😍😍😍🥰🥰</span>
        </span>
        <em className="garden-plant-hint">Tap anywhere to plant another flower</em>
      </button>
    </div>
  )
}
