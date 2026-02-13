import { ConfessionPage } from '../features/confession/ConfessionPage'
import { MusicPlayerProvider } from '../features/music-player/MusicPlayerProvider'

export default function App() {
  return <MusicPlayerProvider><ConfessionPage /></MusicPlayerProvider>
}
