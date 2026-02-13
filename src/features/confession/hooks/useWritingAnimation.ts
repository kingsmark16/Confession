import { useEffect, useState } from 'react'

const wordsPerMinute = 75
const millisecondsPerMinute = 60000
const minimumDuration = 5000
const maximumDuration = 30000

export function useWritingAnimation(text: string, isEnabled: boolean) {
  const [displayedText, setDisplayedText] = useState('')
  const [isWriting, setIsWriting] = useState(false)

  useEffect(() => {
    let animationFrame = 0
    const startTimeout = window.setTimeout(() => {
      if (!isEnabled) {
        setDisplayedText('')
        setIsWriting(false)
        return
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        setDisplayedText(text)
        setIsWriting(false)
        return
      }

      const wordCount = text.trim().split(/\s+/).length
      const readingDuration = (wordCount / wordsPerMinute) * millisecondsPerMinute
      const duration = Math.min(maximumDuration, Math.max(minimumDuration, readingDuration))
      let previousCharacterCount = 0
      const startTime = performance.now()

      setDisplayedText('')
      setIsWriting(true)

      const write = (currentTime: number) => {
        const progress = Math.min(1, (currentTime - startTime) / duration)
        const characterCount = Math.floor(progress * text.length)

        if (characterCount !== previousCharacterCount) {
          previousCharacterCount = characterCount
          setDisplayedText(text.slice(0, characterCount))
        }

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(write)
        } else {
          setDisplayedText(text)
          setIsWriting(false)
        }
      }

      animationFrame = window.requestAnimationFrame(write)
    }, 0)

    return () => {
      window.clearTimeout(startTimeout)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [isEnabled, text])

  return { displayedText, isWriting }
}
