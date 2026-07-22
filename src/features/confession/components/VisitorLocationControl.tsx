import { useState } from 'react'
import { requestPreciseLocation } from '../lib/views'

type LocationStatus = 'idle' | 'requesting' | 'success' | 'denied' | 'unavailable' | 'error'

export function VisitorLocationControl() {
  const [status, setStatus] = useState<LocationStatus>('idle')

  const handleRequest = async () => {
    setStatus('requesting')
    setStatus(await requestPreciseLocation('confession'))
  }

  const statusMessage = {
    idle: '',
    requesting: 'Waiting for your location permission...',
    success: 'Your city was updated. Thank you for sharing.',
    denied: 'Location permission was not granted. Your approximate city remains unchanged.',
    unavailable: 'Precise location is unavailable in this browser or connection.',
    error: 'We could not update your city right now. Your page still works normally.',
  }[status]

  return (
    <section aria-labelledby="location-title" className="section location-section">
      <div className="location-card">
        <p className="location-eyebrow">A LITTLE MORE ACCURATE</p>
        <h2 id="location-title">SHARE YOUR CITY?</h2>
        <p className="location-copy">
          Optional: allow your browser to improve your city result. Exact coordinates are used briefly to find your city, then only city and country are saved.
        </p>
        <button className="location-button" disabled={status === 'requesting' || status === 'success'} onClick={handleRequest} type="button">
          {status === 'requesting' ? 'CHECKING LOCATION...' : status === 'success' ? 'CITY UPDATED' : 'ALLOW LOCATION'}
        </button>
        <p aria-live="polite" className="location-status">{statusMessage}</p>
      </div>
    </section>
  )
}
