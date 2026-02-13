import { useAutoHideNav } from './useAutoHideNav'
import { useMusicPlayer } from '../../features/music-player/musicPlayerContext'

export function SiteNav() {
  const isVisible = useAutoHideNav()
  const { openPlayer } = useMusicPlayer()

  return (
    <nav aria-label="Primary" className="top-nav" data-visible={isVisible}>
      <a className="wordmark" href="#top">FOR GUELDA</a>
      <div className="nav-links">
        <a href="#confession">READ!</a>
        <a href="#gallery">LOOK!</a>
        <a href="#reasons">LOVE!</a>
      </div>
      <button aria-controls="music-player-dialog" aria-haspopup="dialog" className="jam-link" onClick={openPlayer} type="button">PLAY A SONG!</button>
    </nav>
  )
}
