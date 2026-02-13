import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent, RefObject } from 'react'
import { createGardenFlower, flowerSpeciesLabels, initialGardenFlowers } from './garden.data'
import type { GardenFlower } from './garden.types'

const maximumDesktopFlowers = 34
const maximumMobileFlowers = 22
const flowerInterval = 2400
const flowerRemovalDuration = 1200

type RomanticGardenState = {
  announcement: string
  flowers: GardenFlower[]
  growFlower: (event: MouseEvent<HTMLButtonElement>) => void
  handlePointerLeave: () => void
  handlePointerMove: (event: PointerEvent<HTMLButtonElement>) => void
  stageRef: RefObject<HTMLButtonElement | null>
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return prefersReducedMotion
}

export function useRomanticGarden(): RomanticGardenState {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [announcement, setAnnouncement] = useState('')
  const [flowers, setFlowers] = useState<GardenFlower[]>(initialGardenFlowers)
  const flowersRef = useRef<GardenFlower[]>(initialGardenFlowers)
  const stageRef = useRef<HTMLButtonElement>(null)
  const sequenceRef = useRef(initialGardenFlowers.length)
  const isActiveRef = useRef(true)
  const pointerRef = useRef({ x: 0, y: 0 })
  const removalTimersRef = useRef<number[]>([])

  const addFlower = useCallback((x: number) => {
    const isMobile = window.matchMedia('(max-width: 42rem)').matches
    const maximumFlowers = isMobile ? maximumMobileFlowers : maximumDesktopFlowers
    const minimumX = isMobile ? 8 : 4
    const sequence = sequenceRef.current
    sequenceRef.current += 1

    const flower = createGardenFlower(
      `garden-flower-${sequence}`,
      Math.min(100 - minimumX, Math.max(minimumX, x)),
      sequence,
    )
    const current = flowersRef.current
    const activeFlowers = current.filter((item) => !item.isLeaving)
    let nextFlowers: GardenFlower[]

    if (prefersReducedMotion) {
      nextFlowers = [...activeFlowers.slice(-(maximumFlowers - 1)), flower]
    } else if (activeFlowers.length >= maximumFlowers) {
      const oldestFlower = activeFlowers[0]
      nextFlowers = [
        ...current.map((item) => item.id === oldestFlower.id ? { ...item, isLeaving: true } : item),
        flower,
      ]

      const timerId = window.setTimeout(() => {
        const remainingFlowers = flowersRef.current.filter((item) => item.id !== oldestFlower.id)
        flowersRef.current = remainingFlowers
        setFlowers(remainingFlowers)
        removalTimersRef.current = removalTimersRef.current.filter((item) => item !== timerId)
      }, flowerRemovalDuration)
      removalTimersRef.current.push(timerId)
    } else {
      nextFlowers = [...current, flower]
    }

    flowersRef.current = nextFlowers
    setFlowers(nextFlowers)
    return flower
  }, [prefersReducedMotion])

  const growFlower = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const hasPointerPosition = event.clientX > 0
    const x = hasPointerPosition ? ((event.clientX - bounds.left) / bounds.width) * 100 : 50
    const flower = addFlower(x)
    setAnnouncement(`A ${flowerSpeciesLabels[flower.species]} is growing. Watch it bloom.`)
  }, [addFlower])

  const handlePointerMove = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerRef.current = {
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
    }
  }, [])

  const handlePointerLeave = useCallback(() => {
    pointerRef.current = { x: 0, y: 0 }
  }, [])

  useEffect(() => () => {
    removalTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return
    const intervalId = window.setInterval(() => {
      if (isActiveRef.current && !document.hidden) addFlower(4 + Math.random() * 92)
    }, flowerInterval)
    return () => window.clearInterval(intervalId)
  }, [addFlower, prefersReducedMotion])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(([entry]) => {
      isActiveRef.current = entry.isIntersecting
    }, { threshold: 0.01 })

    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const minimumFrameDuration = window.matchMedia('(max-width: 42rem)').matches ? 1000 / 30 : 1000 / 60
    let animationFrame = 0
    let previousFrameTime = 0
    let wind = 0
    let parallaxX = 0
    let parallaxY = 0

    const animate = (time: number) => {
      const stage = stageRef.current
      const isNextFrame = time - previousFrameTime >= minimumFrameDuration
      if (stage && isActiveRef.current && !document.hidden && isNextFrame) {
        previousFrameTime = time
        const naturalWind = Math.sin(time / 3600) * 0.72 + Math.sin(time / 1700) * 0.28
        const targetWind = naturalWind + pointerRef.current.x * 0.72
        wind += (targetWind - wind) * 0.06
        parallaxX += (pointerRef.current.x - parallaxX) * 0.075
        parallaxY += (pointerRef.current.y - parallaxY) * 0.075

        stage.style.setProperty('--garden-wind', wind.toFixed(3))
        stage.style.setProperty('--garden-parallax-x', parallaxX.toFixed(3))
        stage.style.setProperty('--garden-parallax-y', parallaxY.toFixed(3))
      }
      animationFrame = window.requestAnimationFrame(animate)
    }

    animationFrame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [prefersReducedMotion])

  return { announcement, flowers, growFlower, handlePointerLeave, handlePointerMove, stageRef }
}
