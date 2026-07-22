import { useState } from 'react'
import { SiteFooter } from '../../components/layout/SiteFooter'
import { ConfessionLetter } from './components/ConfessionLetter'
import { FinalCta } from './components/FinalCta'
import { FloatingEmojis } from './components/FloatingEmojis'
import { HeroSection } from './components/HeroSection'
import { MemoryGallery } from './components/MemoryGallery'
import { ReasonsSection } from './components/ReasonsSection'
import { ReplySection } from './components/ReplySection'
import { createResponse, getStoredResponseId, updateResponse } from './lib/responses'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'

export function ConfessionPage() {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)
  const [responseId, setResponseId] = useState<string | null>(null)
  const [isGardenActive, setIsGardenActive] = useState(false)
  const isVisible = useRevealOnScroll()

  const saveAnswer = async (nextAnswer: 'yes' | 'no') => {
    const existingResponseId = responseId ?? getStoredResponseId()
    if (existingResponseId) {
      await updateResponse(existingResponseId, nextAnswer)
      setResponseId(existingResponseId)
    } else {
      const id = await createResponse(nextAnswer)
      setResponseId(id)
    }
    setAnswer(nextAnswer)
  }

  return (
    <div className={`site-shell ${isGardenActive ? 'is-garden-active' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to the confession</a>
      <FloatingEmojis isPaused={isGardenActive} />
      <HeroSection />
      <main id="main-content">
        <ConfessionLetter isVisible={isVisible('confession-card')} />
        <MemoryGallery isVisible={isVisible} />
        <ReasonsSection isVisible={isVisible} />
        <FinalCta isVisible={isVisible('finale-card')} onAnswer={saveAnswer} onGardenChange={setIsGardenActive} />
        <ReplySection answer={answer} responseId={responseId} onResponseCreated={setResponseId} />
      </main>
      <SiteFooter />
    </div>
  )
}
