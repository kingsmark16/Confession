import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { MusicPlayerDialog } from './components/MusicPlayerDialog'
import { RomanticPlayingAnimation } from './components/RomanticPlayingAnimation'
import { bundledSongs } from './musicPlayer.data'
import { MusicPlayerContext } from './musicPlayerContext'

type MusicPlayerProviderProps = {
  children: ReactNode
}

export function MusicPlayerProvider({ children }: MusicPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const continuePlaybackRef = useRef(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState('')

  const songs = bundledSongs
  const currentSong = songs[currentIndex]

  const playAudio = useCallback(async () => {
    if (!audioRef.current) return
    try {
      await audioRef.current.play()
      setError('')
    } catch {
      setError('This song could not be played. Try another supported audio file.')
      setIsPlaying(false)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.src = currentSong.url
    audio.load()
    if (continuePlaybackRef.current) {
      void audio.play().catch(() => {
        setError('This song could not be played. Try another supported audio file.')
        setIsPlaying(false)
      })
    }
  }, [currentSong, playAudio])

  const moveToSong = useCallback((nextIndex: number, continuePlayback: boolean) => {
    const audio = audioRef.current
    if (!songs.length || !audio) return

    continuePlaybackRef.current = continuePlayback
    if (nextIndex === currentIndex) {
      audio.currentTime = 0
      if (continuePlayback) void playAudio()
      return
    }
    setCurrentIndex(nextIndex)
  }, [currentIndex, playAudio, songs.length])

  const playPrevious = () => {
    if (!songs.length) return
    const nextIndex = (currentIndex - 1 + songs.length) % songs.length
    moveToSong(nextIndex, isPlaying)
  }

  const playNext = () => {
    if (!songs.length) return
    const nextIndex = (currentIndex + 1) % songs.length
    moveToSong(nextIndex, isPlaying)
  }

  const handleEnded = () => {
    if (!songs.length) return
    const nextIndex = (currentIndex + 1) % songs.length
    moveToSong(nextIndex, true)
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    continuePlaybackRef.current = !isPlaying
    if (audio.paused) void playAudio()
    else audio.pause()
  }

  const selectSong = (index: number) => moveToSong(index, true)

  const contextValue = useMemo(() => ({ openPlayer: () => setIsOpen(true) }), [])

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
      <audio
        onEnded={handleEnded}
        onError={() => setError('This song could not be played. Try another supported audio file.')}
        onPause={() => {
          if (!audioRef.current?.ended) setIsPlaying(false)
        }}
        onPlay={() => setIsPlaying(true)}
        preload="metadata"
        ref={audioRef}
      />
      <RomanticPlayingAnimation isPlaying={isPlaying} />
      <MusicPlayerDialog
        currentIndex={currentIndex}
        currentSong={currentSong}
        error={error}
        isOpen={isOpen}
        isPlaying={isPlaying}
        onClose={() => setIsOpen(false)}
        onNext={playNext}
        onPlayPrevious={playPrevious}
        onSelectSong={selectSong}
        onTogglePlay={togglePlay}
        songs={songs}
      />
    </MusicPlayerContext.Provider>
  )
}
