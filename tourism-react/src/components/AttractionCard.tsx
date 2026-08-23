interface AttractionCardProps {
  name: string
  img: string
  onClick: () => void
}

export default function AttractionCard({ name, img, onClick }: AttractionCardProps) {
  return (
    <div
      className="dest-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`Explore ${name}`}
    >
      <img src={img} alt={name} loading="lazy" />
      <div className="card-overlay">
        <h3>{name}</h3>
        <p>Click to explore services</p>
      </div>
    </div>
  )
}
