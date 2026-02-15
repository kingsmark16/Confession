import { useEffect, useRef } from 'react'
import { Music2, Pause, Play, SkipBack, SkipForward, X } from 'lucide-react'
import type { MouseEvent } from 'react'
import type { Song } from '../musicPlayer.types'

type MusicPlayerDialogProps = {
  currentIndex: number
  currentSong: Song
  error: string
  isOpen: boolean
  isPlaying: boolean
  onClose: () => void
  onNext: () => void
  onPlayPrevious: () => void
  onSelectSong: (index: number) => void
  onTogglePlay: () => void
  songs: Song[]
}

export function MusicPlayerDialog({ currentIndex, currentSong, error, isOpen, isPlaying, onClose, onNext, onPlayPrevious, onSelectSong, onTogglePlay, songs }: MusicPlayerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  useEffect(() => {
    document.documentElement.classList.toggle('music-dialog-open', isOpen)
    return () => document.documentElement.classList.remove('music-dialog-open')
  }, [isOpen])

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const clickedOutside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom
    if (clickedOutside) onClose()
  }

  return (
    <dialog
      aria-describedby="music-player-description"
      aria-labelledby="music-player-title"
      className="music-dialog"
      id="music-player-dialog"
      onClick={handleBackdropClick}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      ref={dialogRef}
    >
      <div className="music-panel">
        <button aria-label="Close music player" className="music-close" onClick={onClose} type="button"><X aria-hidden="true" /></button>
        <div className="music-heading">
          <span className="music-heading-icon"><Music2 aria-hidden="true" /></span>
          <div>
            <p className="music-eyebrow">OUR SOUNDTRACK!</p>
            <h2 id="music-player-title">OUR LOVE SONGS</h2>
          </div>
        </div>
        <p id="music-player-description">Pick a favorite or let every song play in order.</p>

        <div aria-live="polite" className="now-playing">
          <span>{isPlaying ? 'NOW PLAYING' : 'READY TO PLAY'}</span>
          <strong>{currentSong.name}</strong>
        </div>
        <div aria-label="Music controls" className="music-controls" role="group">
          <button aria-label="Previous song" onClick={onPlayPrevious} type="button"><SkipBack aria-hidden="true" fill="currentColor" /></button>
          <button aria-label={isPlaying ? 'Pause song' : 'Play song'} className="music-play" onClick={onTogglePlay} type="button">
            {isPlaying ? <Pause aria-hidden="true" fill="currentColor" /> : <Play aria-hidden="true" fill="currentColor" />}
          </button>
          <button aria-label="Next song" onClick={onNext} type="button"><SkipForward aria-hidden="true" fill="currentColor" /></button>
        </div>
        <ol aria-label="Love song playlist" className="song-list">
          {songs.map((song, index) => (
            <li key={song.id}>
              <button aria-current={index === currentIndex ? 'true' : undefined} onClick={() => onSelectSong(index)} type="button">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{song.name}</strong>
                {index === currentIndex && <em>{isPlaying ? 'PLAYING' : 'SELECTED'}</em>}
              </button>
            </li>
          ))}
        </ol>

        {error && <p className="music-error" role="alert">{error}</p>}
        <p className="music-hint">You can close this popup while the music keeps playing.</p>
      </div>
    </dialog>
  )
}
