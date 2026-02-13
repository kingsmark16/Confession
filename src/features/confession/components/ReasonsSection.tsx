import { Smile, Sparkles, Zap } from 'lucide-react'
import { reasons } from '../confession.data'

const icons = { sparkles: Sparkles, smile: Smile, zap: Zap }

type ReasonsSectionProps = { isVisible: (id: string) => boolean }

export function ReasonsSection({ isVisible }: ReasonsSectionProps) {
  return (
    <section className="section reasons-section" id="reasons">
      <h2 className="sr-only">Reasons why I adore you</h2>
      <ul className="reasons-grid">
        {reasons.map((reason, index) => {
          const Icon = icons[reason.icon]
          const id = `reason-${index}`
          return (
            <li className={`reason-card reason-${reason.tone} reveal-card ${isVisible(id) ? 'is-visible' : ''}`} data-reveal id={id} key={reason.title}>
              <span className="reason-icon"><Icon aria-hidden="true" /></span>
              <h3>{reason.title}</h3>
              <p>{reason.copy}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
