interface ServiceCardProps {
  icon: string
  title: string
  description: string
  onClick: () => void
}

export default function ServiceCard({ icon, title, description, onClick }: ServiceCardProps) {
  return (
    <div
      className="service-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={title}
    >
      <i className={`${icon} text-5xl text-navy mb-5 block`} />
      <h3 className="font-heading text-[1.3rem] text-navy mb-2.5">{title}</h3>
      <p className="text-[#555] text-sm leading-[1.6]">{description}</p>
    </div>
  )
}
