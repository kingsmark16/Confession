import { useEffect, useRef, useState } from 'react'

export function useAutoHideNav() {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const framePending = useRef(false)
  const answerTransitionPending = useRef(false)

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const hideForAnswerTransition = () => {
      answerTransitionPending.current = true
      setIsVisible(false)
    }

    window.addEventListener('confession-answer-transition', hideForAnswerTransition)

    const handleScroll = () => {
      if (framePending.current) return
      framePending.current = true

      window.requestAnimationFrame(() => {
        const currentScrollY = Math.max(window.scrollY, 0)
        const scrollDelta = currentScrollY - lastScrollY.current

        if (answerTransitionPending.current) {
          if (currentScrollY <= 24 || scrollDelta < -4) {
            answerTransitionPending.current = false
            setIsVisible(true)
          }
        } else if (currentScrollY <= 24) {
          setIsVisible(true)
        } else if (Math.abs(scrollDelta) > 4) {
          setIsVisible(scrollDelta < 0)
        }

        lastScrollY.current = currentScrollY
        framePending.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('confession-answer-transition', hideForAnswerTransition)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return isVisible
}
