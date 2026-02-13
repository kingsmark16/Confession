import { useState } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { letterMessage, letterRecipient, letterSignature, splitLetterIntoPages } from '../letter.data'
import { useWritingAnimation } from '../hooks/useWritingAnimation'

type ConfessionLetterProps = { isVisible: boolean }

export function ConfessionLetter({ isVisible }: ConfessionLetterProps) {
  const [page, setPage] = useState(0)
  const [pageDirection, setPageDirection] = useState<'next' | 'prev'>('next')
  const pages = splitLetterIntoPages(letterMessage)
  const totalPages = pages.length
  const currentMessage = pages[page]
  const { displayedText, isWriting } = useWritingAnimation(currentMessage, isVisible)

  const changePage = (nextPage: number, direction: 'next' | 'prev') => {
    setPageDirection(direction)
    setPage(nextPage)
  }

  return (
    <section className="section confession-section" id="confession">
      <article className={`confession-card reveal-card ${isVisible ? 'is-visible' : ''}`} data-reveal id="confession-card">
        <span className="boom-label">LETTER!</span>
        <Heart aria-hidden="true" className="letter-romance letter-romance-top" fill="currentColor" />
        <Sparkles aria-hidden="true" className="letter-romance letter-romance-bottom" />
        <p className="letter-salutation"><span>DEAR,</span> <strong>{letterRecipient}</strong></p>
        <p className={`letter-message letter-message-${pageDirection}`} key={page}>
          <span aria-hidden="true" className="letter-message-reserve">{currentMessage}</span>
          <span aria-hidden="true" className="letter-message-written">
            {displayedText}
            {isWriting && <span className="letter-writing-cursor" />}
          </span>
          <span className="sr-only">{currentMessage}</span>
        </p>
        <div aria-label="Letter pages" className="letter-navigation">
          <button aria-label="Previous letter page" disabled={page === 0} onClick={() => changePage(Math.max(0, page - 1), 'prev')} type="button">PREV</button>
          <span aria-live="polite">{page + 1} OUT OF {totalPages}</span>
          <button aria-label="Next letter page" disabled={page === totalPages - 1} onClick={() => changePage(Math.min(totalPages - 1, page + 1), 'next')} type="button">NEXT</button>
        </div>
        <footer><span>TOTALLY YOURS!</span><strong>{letterSignature}</strong></footer>
      </article>
    </section>
  )
}
