import { useEffect, useState } from 'react'
import { Flower2, Gift, Heart, HeartHandshake, Sparkles, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const romanticIcons: LucideIcon[] = [Heart, Sparkles, Flower2, Gift, HeartHandshake, Star, Heart, Sparkles, Flower2, Heart]

export function FloatingEmojis({ isPaused = false }: { isPaused?: boolean }) {
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    let timeoutId: number | undefined

    const handleScroll = () => {
      setIsScrolling(true)
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => setIsScrolling(false), 140)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div aria-hidden="true" className={`emoji-sky ${isScrolling ? 'is-scrolling' : ''} ${isPaused ? 'is-paused' : ''}`}>
      {romanticIcons.map((Icon, index) => (
        <span key={`${Icon.displayName ?? 'romantic-icon'}-${index}`}>
          <Icon fill={Icon === Heart ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </span>
      ))}
    </div>
  )
}
