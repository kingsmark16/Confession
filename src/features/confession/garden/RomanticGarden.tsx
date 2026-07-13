import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { bouquetFlowers, visitorBudColors } from './bouquet.data'
import type { BouquetFlower, VisitorBud } from './bouquet.data'

const maximumVisitorBuds = 5
const petalIndexes = Array.from({ length: 20 })
const textureDots = Array.from({ length: 18 })

type RimFlower = {
  flower: BouquetFlower
  scale: number
  x: number
  y: number
}

const rimFlowers: RimFlower[] = [
  { flower: { color: 'gold', delay: 0.04, id: 'rim-gold-back-left', kind: 'pom', label: 'tiny yellow pom flower', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.28, x: 252, y: 486 },
  { flower: { color: 'cream', delay: 0.1, id: 'rim-cream-back-left', kind: 'rose', label: 'tiny cream rose', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.29, x: 276, y: 482 },
  { flower: { color: 'blush', delay: 0.18, id: 'rim-blush-back-center', kind: 'mum', label: 'tiny blush flower', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.3, x: 300, y: 480 },
  { flower: { color: 'pink', delay: 0.26, id: 'rim-pink-back-right', kind: 'carnation', label: 'tiny pink carnation', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.29, x: 324, y: 482 },
  { flower: { color: 'orange', delay: 0.34, id: 'rim-orange-back-right', kind: 'carnation', label: 'tiny orange carnation', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.27, x: 348, y: 486 },
  { flower: { color: 'cream', delay: 0.08, id: 'rim-cream-left', kind: 'rose', label: 'small cream rose', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.32, x: 244, y: 504 },
  { flower: { color: 'blush', delay: 0.16, id: 'rim-blush-left', kind: 'mum', label: 'small blush flower', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.36, x: 262, y: 501 },
  { flower: { color: 'pink', delay: 0.24, id: 'rim-pink-left', kind: 'carnation', label: 'small pink carnation', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.38, x: 280, y: 499 },
  { flower: { color: 'gold', delay: 0.32, id: 'rim-gold-center', kind: 'pom', label: 'small yellow pom flower', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.43, x: 300, y: 498 },
  { flower: { color: 'cream', delay: 0.4, id: 'rim-cream-right', kind: 'rose', label: 'small cream rose', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.38, x: 320, y: 499 },
  { flower: { color: 'orange', delay: 0.48, id: 'rim-orange-right', kind: 'carnation', label: 'small orange carnation', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.36, x: 338, y: 501 },
  { flower: { color: 'blush', delay: 0.56, id: 'rim-blush-far-right', kind: 'mum', label: 'small blush flower', scale: 1, stemCurve: 0, x: 0, y: 0 }, scale: 0.32, x: 356, y: 504 },
]

function stemPath(flower: BouquetFlower) {
  const startX = 300 + flower.stemCurve * 0.18
  const controlX = 300 + flower.stemCurve
  return `M ${startX} 530 Q ${controlX} 410 ${flower.x} ${flower.y + 24}`
}

function FlowerHead({ flower }: { flower: BouquetFlower }) {
  const isSunflower = flower.kind === 'sunflower'
  const isPom = flower.kind === 'pom'
  const isMum = flower.kind === 'mum'
  const isCarnation = flower.kind === 'carnation'
  const count = isSunflower || isMum ? 20 : isPom ? 18 : isCarnation ? 16 : 12

  return (
    <g className={`bouquet-bloom flower-${flower.kind} color-${flower.color}`}>
      <g className="bouquet-sepals">
        {Array.from({ length: 5 }, (_, index) => (
          <ellipse key={index} rx="10" ry="25" transform={`rotate(${index * 72}) translate(0 -18)`} />
        ))}
      </g>
      <g className="bouquet-petals">
        {petalIndexes.slice(0, count).map((_, index) => {
          const angle = index * (360 / count)
          const radius = isSunflower ? 32 : isMum ? 29 : isPom ? 24 : isCarnation ? 25 + (index % 3) * 3 : 22
          const petalWidth = isSunflower ? 11 : isMum ? 8 : isPom ? 14 : isCarnation ? 17 : 16
          const petalHeight = isSunflower ? 35 : isMum ? 28 : isPom ? 18 : isCarnation ? 24 : 27
          return (
            <ellipse
              className="bouquet-petal"
              key={index}
              rx={petalWidth}
              ry={petalHeight}
              style={{ '--petal-order': index } as CSSProperties}
              transform={`rotate(${angle}) translate(0 -${radius})`}
            />
          )
        })}
      </g>
      <circle className="bouquet-flower-center" r={isSunflower ? 27 : isPom ? 15 : isMum ? 14 : 13} />
      <g className="bouquet-center-texture">
        {textureDots.slice(0, isSunflower ? 18 : 10).map((_, index) => {
          const angle = index * 137.5 * (Math.PI / 180)
          const radius = 3 + index * (isSunflower ? 1.15 : 0.7)
          return <circle cx={Math.cos(angle) * radius} cy={Math.sin(angle) * radius} key={index} r={isSunflower ? 1.9 : 1.3} />
        })}
      </g>
      <ellipse className="bouquet-dew" cx="18" cy="-20" rx="3.5" ry="5" />
    </g>
  )
}

type InteractiveFlowerProps = {
  activeFlower: string | null
  flower: BouquetFlower
  onActivate: (flower: BouquetFlower) => void
}

function InteractiveFlower({ activeFlower, flower, onActivate }: InteractiveFlowerProps) {
  const handleKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onActivate(flower)
  }

  return (
    <g
      aria-label={`Brighten the ${flower.label}`}
      className={`bouquet-flower ${activeFlower === flower.id ? 'is-active' : ''}`}
      data-flower
      onClick={(event) => {
        event.stopPropagation()
        onActivate(flower)
      }}
      onKeyDown={handleKeyDown}
      role="button"
      style={{
        '--flower-delay': `${flower.delay}s`,
        '--flower-scale': flower.scale,
      } as CSSProperties}
      tabIndex={0}
      transform={`translate(${flower.x} ${flower.y})`}
    >
      <path className="bouquet-stem" d={stemPath(flower)} transform={`translate(${-flower.x} ${-flower.y})`} />
      <g className="bouquet-leaf bouquet-leaf-one" transform="translate(-12 78) rotate(-28)">
        <path d="M 0 0 C -34 -10 -42 18 -3 23 C 7 16 8 8 0 0 Z" />
        <path className="bouquet-leaf-vein" d="M -31 13 Q -12 12 0 3" />
      </g>
      <g className="bouquet-leaf bouquet-leaf-two" transform="translate(10 126) rotate(22)">
        <path d="M 0 0 C 34 -10 42 18 3 23 C -7 16 -8 8 0 0 Z" />
        <path className="bouquet-leaf-vein" d="M 31 13 Q 12 12 0 3" />
      </g>
      <g className="bouquet-head">
        <FlowerHead flower={flower} />
        {activeFlower === flower.id ? (
          <g className="flower-touch-sparkles" key={`${flower.id}-sparkles`}>
            {Array.from({ length: 8 }, (_, index) => (
              <circle key={index} r="3" transform={`rotate(${index * 45}) translate(0 -58)`} />
            ))}
          </g>
        ) : null}
      </g>
    </g>
  )
}

function EucalyptusBranch({ flip = false, x, y }: { flip?: boolean; x: number; y: number }) {
  return (
    <g className="eucalyptus-branch" transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <path className="eucalyptus-stem" d="M 0 290 Q 12 150 92 0" />
      {Array.from({ length: 9 }, (_, index) => {
        const branchX = 12 + index * 9
        const branchY = 250 - index * 27
        return (
          <g className="eucalyptus-leaf-pair" key={index} style={{ '--leaf-order': index } as CSSProperties} transform={`translate(${branchX} ${branchY}) rotate(${-32 + index * 4})`}>
            <ellipse cx="-11" cy="0" rx="15" ry="9" transform="rotate(-22)" />
            <ellipse cx="12" cy="-6" rx="15" ry="9" transform="rotate(24)" />
          </g>
        )
      })}
    </g>
  )
}

function VisitorFlowerBud({ bud }: { bud: VisitorBud }) {
  const path = `M 300 530 Q ${300 + bud.lean} 470 ${bud.x} ${bud.y}`
  return (
    <g className={`visitor-bud color-${bud.color} ${bud.isLeaving ? 'is-leaving' : ''}`}>
      <path className="visitor-bud-stem" d={path} />
      <g transform={`translate(${bud.x} ${bud.y})`}>
        <path className="visitor-bud-leaf" d="M -2 52 C -28 35 -36 61 -5 70 C 4 64 5 58 -2 52 Z" />
        <g className="visitor-bud-head">
          <ellipse rx="17" ry="25" />
          <path className="visitor-bud-sepal" d="M -18 12 Q 0 35 18 12 L 10 30 L 0 17 L -10 30 Z" />
        </g>
      </g>
    </g>
  )
}

function Butterfly({ isApproaching }: { isApproaching: boolean }) {
  return (
    <g className={`svg-butterfly-flight ${isApproaching ? 'is-approaching' : ''}`}>
      <g className="svg-butterfly">
        <path className="butterfly-antenna" d="M -2 -11 Q -12 -25 -20 -20 M 2 -11 Q 12 -25 20 -20" />
        <g className="butterfly-wings">
          <path className="butterfly-wing-left" d="M -3 0 C -48 -48 -70 10 -22 24 C -44 56 -9 58 0 18 Z" />
          <path className="butterfly-wing-right" d="M 3 0 C 48 -48 70 10 22 24 C 44 56 9 58 0 18 Z" />
          <circle cx="-31" cy="3" r="7" /><circle cx="31" cy="3" r="7" />
          <circle cx="-18" cy="29" r="4" /><circle cx="18" cy="29" r="4" />
        </g>
        <ellipse className="butterfly-body" cy="9" rx="5" ry="22" />
        <circle className="butterfly-head" cy="-13" r="7" />
      </g>
    </g>
  )
}

function Bee({ className, isApproaching }: { className: string; isApproaching: boolean }) {
  return (
    <g className={`svg-bee-flight ${className} ${isApproaching ? 'is-approaching' : ''}`}>
      <g className="svg-bee">
        <ellipse className="bee-wing bee-wing-left" cx="-6" cy="-8" rx="11" ry="7" />
        <ellipse className="bee-wing bee-wing-right" cx="8" cy="-9" rx="11" ry="7" />
        <ellipse className="bee-body" rx="16" ry="10" />
        <path className="bee-stripes" d="M -8 -8 Q -4 0 -8 8 M 1 -10 Q 5 0 1 10" />
        <circle className="bee-head" cx="14" cy="-1" r="8" />
        <circle className="bee-eye" cx="17" cy="-4" r="2" />
      </g>
    </g>
  )
}

export function RomanticGarden() {
  const [activeFlower, setActiveFlower] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('The bouquet is beginning to grow.')
  const [buds, setBuds] = useState<VisitorBud[]>([])
  const [insectTarget, setInsectTarget] = useState<'bee-one' | 'bee-two' | 'butterfly' | null>(null)
  const [replayCycle, setReplayCycle] = useState(0)
  const activeTimerRef = useRef<number | undefined>(undefined)
  const budsRef = useRef<VisitorBud[]>([])
  const budTimersRef = useRef<number[]>([])
  const budSequenceRef = useRef(0)
  const frameRef = useRef<number | undefined>(undefined)
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const activateFlower = useCallback((flower: BouquetFlower) => {
    window.clearTimeout(activeTimerRef.current)
    setActiveFlower(flower.id)
    setInsectTarget(flower.x < 260 ? 'butterfly' : flower.x > 360 ? 'bee-one' : 'bee-two')
    stageRef.current?.style.setProperty('--focus-x', `${flower.x}px`)
    stageRef.current?.style.setProperty('--focus-y', `${flower.y}px`)
    setAnnouncement(`The ${flower.label} is glowing for you.`)
    activeTimerRef.current = window.setTimeout(() => {
      setActiveFlower(null)
      setInsectTarget(null)
    }, 1800)
  }, [])

  const addBud = useCallback((x: number) => {
    const sequence = budSequenceRef.current
    budSequenceRef.current += 1
    const nextBud: VisitorBud = {
      color: visitorBudColors[sequence % visitorBudColors.length],
      id: sequence,
      lean: (x - 300) * 0.42,
      x: Math.min(455, Math.max(145, x)),
      y: 405 - (sequence % 3) * 22,
    }

    const current = budsRef.current
    const activeBuds = current.filter((bud) => !bud.isLeaving)
    if (activeBuds.length < maximumVisitorBuds) {
      const nextBuds = [...current, nextBud]
      budsRef.current = nextBuds
      setBuds(nextBuds)
    } else {
      const oldestBud = activeBuds[0]
      const timerId = window.setTimeout(() => {
        const remainingBuds = budsRef.current.filter((bud) => bud.id !== oldestBud.id)
        budsRef.current = remainingBuds
        setBuds(remainingBuds)
        budTimersRef.current = budTimersRef.current.filter((timer) => timer !== timerId)
      }, 650)
      budTimersRef.current.push(timerId)
      const nextBuds = [...current.map((bud) => bud.id === oldestBud.id ? { ...bud, isLeaving: true } : bud), nextBud]
      budsRef.current = nextBuds
      setBuds(nextBuds)
    }
    setAnnouncement('A new little bud is growing in the vase.')
  }, [])

  const handleStagePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    const target = event.target as Element
    if (target.closest('[data-flower]')) return
    const svg = svgRef.current
    const matrix = svg?.getScreenCTM()
    if (!svg || !matrix) return
    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    addBud(point.matrixTransform(matrix.inverse()).x)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    const stage = stageRef.current
    if (!stage || frameRef.current) return
    const clientX = event.clientX
    frameRef.current = window.requestAnimationFrame(() => {
      const bounds = stage.getBoundingClientRect()
      const normalizedX = Math.max(-1, Math.min(1, ((clientX - bounds.left) / bounds.width - 0.5) * 2))
      stage.style.setProperty('--pointer-bend', `${normalizedX * 1.5}deg`)
      stage.style.setProperty('--pointer-drift', `${normalizedX * 0.8}rem`)
      frameRef.current = undefined
    })
  }

  const resetPointer = () => {
    stageRef.current?.style.setProperty('--pointer-bend', '0deg')
    stageRef.current?.style.setProperty('--pointer-drift', '0rem')
  }

  const replayBloom = () => {
    budTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    budTimersRef.current = []
    budsRef.current = []
    setBuds([])
    setActiveFlower(null)
    setInsectTarget(null)
    setReplayCycle((current) => current + 1)
    setAnnouncement('The bouquet is growing all over again.')
  }

  useEffect(() => () => {
    window.clearTimeout(activeTimerRef.current)
    budTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <div className="garden-experience">
      <div
        className="romantic-garden"
        onPointerLeave={resetPointer}
        onPointerMove={handlePointerMove}
        ref={stageRef}
      >
        <span className="garden-love-note">
          <span>YAAAAY!!! YOU SAID YES!!! MY HEART JUST DID A HAPPY LITTLE DANCE! 💃💖</span>
          <strong>I AM SO HAPPY YOU GAVE US A CHANCE!</strong>
          <span className="garden-celebration">HERE&apos;S TO LAUGHTER, BUTTERFLIES, AND A LOVE STORY WE GET TO WRITE TOGETHER! 😍✨</span>
        </span>

        <div className="bouquet-stage">
          <svg
            aria-label="An interactive bouquet growing inside one glass vase"
            className="bouquet-svg"
            key={replayCycle}
            onPointerDown={handleStagePointerDown}
            preserveAspectRatio="xMidYMid meet"
            ref={svgRef}
            role="group"
            viewBox="0 0 600 760"
          >
            <defs>
              <linearGradient id="glass-gradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="var(--garden-cream)" stopOpacity="0.62" />
                <stop offset="0.45" stopColor="var(--garden-lavender)" stopOpacity="0.16" />
                <stop offset="1" stopColor="var(--garden-pink)" stopOpacity="0.28" />
              </linearGradient>
              <linearGradient id="water-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="var(--garden-glow)" stopOpacity="0.16" />
                <stop offset="1" stopColor="var(--garden-lavender)" stopOpacity="0.34" />
              </linearGradient>
              <filter id="flower-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur result="blur" stdDeviation="7" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <clipPath id="vase-clip"><path d="M 245 520 L 355 520 L 372 565 L 360 724 Q 300 752 240 724 L 228 565 Z" /></clipPath>
            </defs>

            <ellipse className="bouquet-ground-shadow" cx="300" cy="724" rx="155" ry="22" />
            <g className="bouquet-ambient-sparkles">
              {Array.from({ length: 14 }, (_, index) => (
                <circle cx={105 + (index * 83) % 410} cy={125 + (index * 127) % 440} key={index} r={2 + index % 3} style={{ '--sparkle-order': index } as CSSProperties} />
              ))}
            </g>

            <g className="bouquet-growth">
              <EucalyptusBranch x={170} y={236} />
              <EucalyptusBranch flip x={430} y={220} />
              {buds.map((bud) => <VisitorFlowerBud bud={bud} key={bud.id} />)}
              {bouquetFlowers.map((flower) => (
                <InteractiveFlower activeFlower={activeFlower} flower={flower} key={flower.id} onActivate={activateFlower} />
              ))}
            </g>

            <g className="glass-vase">
              <path className="vase-body" d="M 245 520 L 355 520 L 372 565 L 360 724 Q 300 752 240 724 L 228 565 Z" fill="url(#glass-gradient)" />
              <g clipPath="url(#vase-clip)">
                <rect className="vase-water" fill="url(#water-gradient)" height="205" width="180" x="210" y="538" />
                {bouquetFlowers.slice(0, 7).map((flower, index) => (
                  <path className="submerged-stem" d={`M ${270 + index * 10} 728 Q ${285 + flower.stemCurve * 0.2} 625 ${300 + flower.stemCurve * 0.12} 528`} key={flower.id} />
                ))}
              </g>
              <path className="vase-body-outline" d="M 245 520 L 228 565 L 240 724 Q 300 752 360 724 L 372 565 L 355 520" />
              {rimFlowers.map(({ flower, scale, x, y }, index) => (
                <g
                  aria-hidden="true"
                  className="vase-rim-flower"
                  key={flower.id}
                  style={{ '--flower-delay': `${flower.delay}s`, '--rim-delay': `${index * 0.12}s` } as CSSProperties}
                  transform={`translate(${x} ${y}) scale(${scale})`}
                >
                  <FlowerHead flower={flower} />
                </g>
              ))}
              <path className="vase-highlight" d="M 252 548 Q 238 630 255 704" />
              <path className="vase-highlight vase-highlight-small" d="M 270 546 Q 263 578 267 600" />
              <g className="yellow-ribbon">
                <path d="M 232 585 Q 300 603 368 585 L 368 620 Q 300 604 232 620 Z" />
                <path className="ribbon-loop" d="M 300 600 C 253 553 213 581 244 617 C 262 634 284 616 300 600 Z" />
                <path className="ribbon-loop" d="M 300 600 C 347 553 387 581 356 617 C 338 634 316 616 300 600 Z" />
                <path className="ribbon-tail" d="M 285 610 L 260 710 L 291 688 L 304 616 Z" />
                <path className="ribbon-tail" d="M 315 610 L 340 710 L 309 688 L 296 616 Z" />
                <circle cx="300" cy="603" r="17" />
              </g>
              <text className="vase-for-you-text" textAnchor="middle" x="300" y="698">THIS IS FOR YOU</text>
            </g>

            <Butterfly isApproaching={insectTarget === 'butterfly'} />
            <Bee className="svg-bee-one" isApproaching={insectTarget === 'bee-one'} />
            <Bee className="svg-bee-two" isApproaching={insectTarget === 'bee-two'} />
          </svg>
        </div>

        <div className="garden-controls">
          <span className="garden-for-you-label">THIS IS FOR YOU</span>
          <button className="garden-replay-button" onClick={replayBloom} type="button">REPLAY THE BLOOM</button>
        </div>
        <p aria-live="polite" className="sr-only">{announcement}</p>
      </div>
    </div>
  )
}
