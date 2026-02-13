import { Heart, Music2, Sparkles } from 'lucide-react'
import { SiteNav } from '../../../components/layout/SiteNav'
import { useMusicPlayer } from '../../music-player/musicPlayerContext'

export function HeroSection() {
  const { openPlayer } = useMusicPlayer()

  return (
    <header className="hero" id="top">
      <SiteNav />
      <div aria-hidden="true" className="hero-romance">
        <Heart fill="currentColor" />
        <Sparkles />
        <Heart fill="currentColor" />
        <Sparkles />
      </div>
      <div className="hero-copy">
        <p className="hero-title">I ADORE YOU!</p>
        <p className="hero-kicker">AN UNWAVERING LOVE LETTER!!!</p>
        <div className="hero-actions">
          <button aria-controls="music-player-dialog" aria-haspopup="dialog" className="hero-music-button" onClick={openPlayer} type="button">
            <Music2 aria-hidden="true" /> PLAY A SONG!
          </button>
          <a className="hero-cta" href="#confession">READ THIS! <Heart aria-hidden="true" fill="currentColor" /></a>
        </div>
      </div>
    </header>
  )
}
