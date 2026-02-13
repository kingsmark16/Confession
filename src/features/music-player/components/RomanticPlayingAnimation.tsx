import { Heart, Music2, Sparkles } from 'lucide-react'
import bouquet from '../../../assets/icons/bouquet.png'
import camera from '../../../assets/icons/camera.png'
import chocolateBox from '../../../assets/icons/chocolate-box.png'
import dinner from '../../../assets/icons/dinner.png'
import heartsPair from '../../../assets/icons/hearts (1).png'
import hearts from '../../../assets/icons/hearts.png'
import inLove from '../../../assets/icons/in-love.png'
import romanticDateAlt from '../../../assets/icons/romantic-date (1).png'
import romanticDate from '../../../assets/icons/romantic-date.png'
import rose from '../../../assets/icons/rose.png'

const icons = [Heart, Music2, Sparkles, Heart, Music2, Heart, Sparkles, Heart]
const imageIcons = [bouquet, camera, chocolateBox, dinner, heartsPair, hearts, inLove, romanticDateAlt, romanticDate, rose]

type RomanticPlayingAnimationProps = {
  isPlaying: boolean
}

export function RomanticPlayingAnimation({ isPlaying }: RomanticPlayingAnimationProps) {
  if (!isPlaying) return null

  return (
    <div aria-hidden="true" className="music-love-layer">
      {icons.map((Icon, index) => (
        <span key={index}><Icon fill={Icon === Heart ? 'currentColor' : 'none'} /></span>
      ))}
      {imageIcons.map((icon) => (
        <span className="music-love-asset" key={icon}><img alt="" src={icon} /></span>
      ))}
    </div>
  )
}
