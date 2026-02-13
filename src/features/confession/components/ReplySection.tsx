import { useState } from 'react'
import type { FormEvent } from 'react'
import { createResponse, updateResponseMessage } from '../lib/responses'
import { supabase } from '../lib/supabase'

type ReplySectionProps = { answer: 'yes' | 'no' | null; responseId: string | null; onResponseCreated: (id: string) => void }

export function ReplySection({ answer, responseId, onResponseCreated }: ReplySectionProps) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) {
      setStatus('error')
      return
    }

    setStatus('submitting')
    try {
      if (responseId) {
        await updateResponseMessage(responseId, message)
      } else {
        const id = await createResponse(answer, message)
        if (!id) throw new Error('Supabase is not configured')
        onResponseCreated(id)
      }
    } catch {
      setStatus('error')
      return
    }

    setStatus('success')
    setMessage('')
  }

  return (
    <section aria-labelledby="reply-title" className="section reply-section" id="reply">
      <div className="reply-card">
        <p className="reply-eyebrow">A LITTLE SPACE FOR YOUR HEART</p>
        <h2 id="reply-title">WRITE ME SOMETHING</h2>
        <p className="reply-intro">If your heart has words for me, leave them here.</p>
        <form className="reply-form" onSubmit={handleSubmit}>
          <label htmlFor="reply-message">YOUR MESSAGE</label>
          <textarea
            aria-describedby="reply-help"
            id="reply-message"
            onChange={(event) => {
              setMessage(event.target.value)
              setStatus('idle')
            }}
            placeholder="Tell me what is in your heart..."
            value={message}
          />
          <p className="reply-help" id="reply-help">This note stays here on this page for this moment.</p>
          <button disabled={status === 'submitting'} type="submit">
            {status === 'submitting' ? 'SENDING NOTE...' : status === 'success' ? 'NOTE SENT' : 'LEAVE YOUR NOTE'}
          </button>
        </form>
        <p aria-live="polite" className="reply-status">
          {status === 'success' ? 'Your words reached me. Thank you for sharing your heart.' : ''}
          {status === 'error' ? 'The note could not be sent right now. Please try again.' : ''}
        </p>
      </div>
    </section>
  )
}
