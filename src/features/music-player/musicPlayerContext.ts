import { createContext, useContext } from 'react'

export type MusicPlayerContextValue = {
  openPlayer: () => void
}

export const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null)

export function useMusicPlayer() {
  const value = useContext(MusicPlayerContext)
  if (!value) throw new Error('useMusicPlayer must be used inside MusicPlayerProvider')
  return value
}
