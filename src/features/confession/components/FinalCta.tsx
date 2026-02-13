import { useEffect, useRef, useState } from 'react'
import { Heart, HeartHandshake, Sparkles, X } from 'lucide-react'
import type { MouseEvent, PointerEvent } from 'react'
import { RomanticGarden } from '../garden/RomanticGarden'

type FinalCtaProps = { isVisible: boolean; onAnswer: (answer: 'yes' | 'no') => Promise<void> }

export function FinalCta({ isVisible, onAnswer }: FinalCtaProps) {
  const [announcement, setAnnouncement] = useState('')
  const [isAccepted, setIsAccepted] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isRejected, setIsRejected] = useState(false)
  const [noAttempts, setNoAttempts] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const changeMindRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isConfirmOpen && !dialog.open) dialog.showModal()
    if (!isConfirmOpen && dialog.open) dialog.close()
  }, [isConfirmOpen])

  useEffect(() => {
    document.documentElement.classList.toggle('answer-dialog-open', isConfirmOpen)
    return () => document.documentElement.classList.remove('answer-dialog-open')
  }, [isConfirmOpen])

  useEffect(() => {
    if (isRejected) changeMindRef.current?.focus()
  }, [isRejected])

  useEffect(() => {
    if (!isAccepted && !isRejected) return

    const frameId = window.requestAnimationFrame(() => {
      const card = document.getElementById('finale-card')
      if (!card) return
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      card.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center', inline: 'nearest' })
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [isAccepted, isRejected])

  const sayYes = async () => {
    setAnnouncement('Yes selected. A garden is blooming for you.')
    window.dispatchEvent(new Event('confession-answer-transition'))
    setIsAccepted(true)
    setIsRejected(false)
    setIsConfirmOpen(false)
    try {
      await onAnswer('yes')
    } catch (error) {
      console.error('Could not save YES response', error)
      setAnnouncement('Your answer could not be saved right now.')
    }
  }

  const confirmNo = async () => {
    setAnnouncement('No selected. Thank you for being honest.')
    window.dispatchEvent(new Event('confession-answer-transition'))
    setIsRejected(true)
    setIsConfirmOpen(false)
    try {
      await onAnswer('no')
    } catch (error) {
      console.error('Could not save NO response', error)
      setAnnouncement('Your answer could not be saved right now.')
    }
  }

  const changeMyMind = () => {
    setAnnouncement('The question is ready again.')
    setIsRejected(false)
    setNoAttempts(0)
  }

  const advanceNoAttempt = () => setNoAttempts((current) => Math.min(2, current + 1))

  const handleNoClick = () => {
    if (noAttempts < 2) {
      advanceNoAttempt()
      return
    }

    setIsConfirmOpen(true)
  }

  const handleNoPointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && noAttempts < 2) advanceNoAttempt()
  }

  const noButtonMotion = noAttempts === 1 ? 'is-dodging' : noAttempts === 2 ? 'is-returning' : ''

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const clickedOutside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom
    if (clickedOutside) setIsConfirmOpen(false)
  }

  return (
    <section className={`section finale-section ${isAccepted ? 'has-garden' : ''} ${isAccepted || isRejected ? 'has-answer' : ''}`} id="final">
      <div className={`finale-card reveal-card ${isVisible ? 'is-visible' : ''} ${isAccepted ? 'has-yes is-garden' : ''} ${isRejected ? 'is-rejected' : ''}`} data-reveal id="finale-card">
        {isAccepted ? (
          <RomanticGarden />
        ) : isRejected ? (
          <div className="rejection-content">
            <HeartHandshake aria-hidden="true" className="rejection-heart" />
            <p className="rejection-eyebrow">THANK YOU FOR BEING HONEST</p>
            <h2>MY HEART STILL WISHES YOU HAPPINESS</h2>
            <p className="rejection-copy">What I feel is real, but your comfort matters more than the answer I hoped for. Thank you for hearing my heart. I will always wish you a love that feels safe, gentle, and true.</p>
            <button className="change-mind-button" onClick={changeMyMind} ref={changeMindRef} type="button">CHANGE MY MIND</button>
          </div>
        ) : (
          <>
            <div aria-hidden="true" className="finale-sparkles">
              <Sparkles />
              <Heart fill="currentColor" />
              <Sparkles />
            </div>
            <p className="finale-eyebrow">ONE LAST QUESTION...</p>
            <Heart aria-hidden="true" className="final-heart" fill="currentColor" />
            <h2>IS THERE A CHANCE FOR US?</h2>
            <p className="finale-copy">Could this confession be the beginning of something real between us?</p>
            <div aria-label="Your answer" className="answer-buttons" role="group">
              <button onClick={sayYes} type="button">YES, THERE IS!</button>
              <button className={`no-answer-button ${noButtonMotion}`} onClick={handleNoClick} onPointerEnter={handleNoPointerEnter} type="button">NO</button>
            </div>
          </>
        )}
      </div>
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <dialog
        aria-describedby="answer-confirm-description"
        aria-labelledby="answer-confirm-title"
        className="answer-dialog"
        onCancel={(event) => {
          event.preventDefault()
          setIsConfirmOpen(false)
        }}
        onClick={handleBackdropClick}
        ref={dialogRef}
      >
        <div className="answer-confirm-panel">
          <button aria-label="Close confirmation" className="answer-confirm-close" onClick={() => setIsConfirmOpen(false)} type="button"><X aria-hidden="true" /></button>
          <HeartHandshake aria-hidden="true" className="answer-confirm-heart" />
          <p className="answer-confirm-eyebrow">YOUR HEART, YOUR CHOICE</p>
          <h2 id="answer-confirm-title">ARE YOU SURE?</h2>
          <p id="answer-confirm-description">Your answer is safe with me. You can take another moment, or confirm how you truly feel.</p>
          <div className="answer-confirm-actions">
            <button autoFocus onClick={() => setIsConfirmOpen(false)} type="button">LET ME THINK AGAIN</button>
            <button onClick={confirmNo} type="button">YES, I&apos;M SURE</button>
          </div>
        </div>
      </dialog>
    </section>
  )
}
