import { useEffect, useState } from 'react'
import { ConfessionPage } from '../features/confession/ConfessionPage'
import { recordPageView } from '../features/confession/lib/views'
import { MusicPlayerProvider } from '../features/music-player/MusicPlayerProvider'
import { PasswordGate } from '../features/password-gate/PasswordGate'
import { hasUnlockedSession } from '../features/password-gate/passwordGate.session'

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(hasUnlockedSession)

  useEffect(() => {
    void recordPageView('confession')
  }, [])

  if (!isUnlocked) return <PasswordGate onUnlock={() => setIsUnlocked(true)} />

  return <MusicPlayerProvider><ConfessionPage /></MusicPlayerProvider>
}
