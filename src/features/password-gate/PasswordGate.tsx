import { useState } from 'react'
import type { FormEvent } from 'react'
import { sha256 } from '@noble/hashes/sha2.js'
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js'
import { Eye, EyeOff, Heart, KeyRound, Sparkles } from 'lucide-react'
import { saveUnlockedSession } from './passwordGate.session'
import { recordPasswordAttempt } from './passwordAttempts'

function hashPassword(password: string) {
  const normalizedPassword = password.trim().toLocaleLowerCase()
  return bytesToHex(sha256(utf8ToBytes(normalizedPassword)))
}

type PasswordGateProps = {
  onUnlock: () => void
}

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState('')
  const isConfigured = Boolean(__SITE_PASSWORD_HASH__)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isConfigured || isChecking) return

    setIsChecking(true)
    setError('')
    const enteredHash = hashPassword(password)
    const isCorrect = enteredHash === __SITE_PASSWORD_HASH__
    void recordPasswordAttempt(password, isCorrect)

    if (!isCorrect) {
      setError('That is not quite the right name. Try again!')
      setPassword('')
      setIsChecking(false)
      return
    }

    saveUnlockedSession()
    onUnlock()
  }

  return (
    <main className="password-gate">
      <div aria-hidden="true" className="password-gate-shape password-gate-shape-left"><Heart fill="currentColor" /></div>
      <div aria-hidden="true" className="password-gate-shape password-gate-shape-right"><Sparkles /></div>
      <section aria-describedby="password-gate-description" aria-labelledby="password-gate-title" className="password-gate-card">
        <p className="password-gate-sticker">LETTER 4 U!</p>
        <div aria-hidden="true" className="password-gate-icon"><KeyRound /></div>
        <h1 id="password-gate-title">BEFORE YOU ENTER...</h1>
        <p id="password-gate-description">Here’s your clue: <strong className="password-gate-clue">The password is your name 🥳🥳</strong>.</p>

        <p className="password-gate-recipient-note">Only the right girl can open this letter. 💌</p>
        <form className="password-gate-form" onSubmit={handleSubmit}>
          <label htmlFor="site-password">SECRET PASSWORD</label>
          <div className="password-gate-input-wrap">
            <input
              aria-describedby={error ? 'password-gate-error' : undefined}
              aria-invalid={Boolean(error)}
              autoComplete="current-password"
              autoFocus
              disabled={!isConfigured || isChecking}
              id="site-password"
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              type={isVisible ? 'text' : 'password'}
              value={password}
            />
            <button
              aria-label={isVisible ? 'Hide password' : 'Show password'}
              className="password-gate-visibility"
              disabled={!isConfigured}
              onClick={() => setIsVisible((current) => !current)}
              type="button"
            >
              {isVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </button>
          </div>
          <p aria-atomic="true" aria-live="polite" className="password-gate-error" id="password-gate-error">
            {!isConfigured ? 'The site password is not configured. Add SITE_PASSWORD and rebuild the page.' : error}
          </p>
          <button className="password-gate-submit" disabled={!password || !isConfigured || isChecking} type="submit">
            {isChecking ? 'CHECKING...' : 'OPEN MY HEART'}
            <Heart aria-hidden="true" fill="currentColor" />
          </button>
        </form>
        <p className="password-gate-note">Made with courage, code, and a whole lot of feelings.</p>
      </section>
    </main>
  )
}
