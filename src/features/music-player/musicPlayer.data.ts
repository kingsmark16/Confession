import cantHelpFallingInLove from '../../assets/music/Can\'t Help Falling In Love.mp3'
import iThinkTheyCallThisLove from '../../assets/music/I Think They Call This Love.mp3'
import itMightBeYou from '../../assets/music/It Might Be You.mp3'
import libuLibongBuwan from '../../assets/music/Libu-Libong Buwan (Uuwian).mp3'
import saBawatSandali from '../../assets/music/Sa Bawat Sandali.mp3'
import type { Song } from './musicPlayer.types'

export const bundledSongs: Song[] = [
  { id: 'cant-help-falling-in-love', name: "Can't Help Falling In Love", url: cantHelpFallingInLove },
  { id: 'i-think-they-call-this-love', name: 'I Think They Call This Love', url: iThinkTheyCallThisLove },
  { id: 'it-might-be-you', name: 'It Might Be You', url: itMightBeYou },
  { id: 'libu-libong-buwan', name: 'Libu-Libong Buwan (Uuwian)', url: libuLibongBuwan },
  { id: 'sa-bawat-sandali', name: 'Sa Bawat Sandali', url: saBawatSandali },
]
