import { memories } from '../confession.data'

type MemoryGalleryProps = { isVisible: (id: string) => boolean }

export function MemoryGallery({ isVisible }: MemoryGalleryProps) {
  return (
    <section className="section gallery-section" id="gallery">
      <h2 className="section-title">UNFORGETTABLE MOMENT!!!</h2>
      <ul className="memory-grid">
        {memories.map((memory, index) => {
          const id = `memory-${index}`
          return (
            <li className={`memory-card ${memory.tilt} reveal-card ${isVisible(id) ? 'is-visible' : ''}`} data-reveal id={id} key={memory.caption}>
              <div className="memory-image-wrap"><img alt={memory.alt} src={memory.image} /></div>
              <div className="memory-copy"><h3>{memory.caption}</h3><p>{memory.description}</p></div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
