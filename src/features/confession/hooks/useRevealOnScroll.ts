import { useEffect, useState } from 'react'

export function useRevealOnScroll() {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setRevealedIds((current) => {
          const next = new Set(current)
          entries.filter((entry) => entry.isIntersecting).forEach((entry) => next.add(entry.target.id))
          return next
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (id: string) => revealedIds.has(id)
}
