import { useEffect } from 'react'
import type { ModalId } from '../types'
import ServiceCard from './ServiceCard'

interface ServicesSectionProps {
  attraction: string
  onBack: () => void
  onOpenModal: (modal: ModalId) => void
}

const SERVICES: { icon: string; title: string; description: string; modal: ModalId }[] = [
  { icon: 'fas fa-user-tie',         title: 'Book a Guide',        description: 'Hire certified, authentic local guides rated by tourists.',                modal: 'modal-guide' },
  { icon: 'fas fa-hotel',            title: 'Book a Hotel',        description: 'Stay near the attraction. Top-rated on Google Maps.',                     modal: 'modal-hotel' },
  { icon: 'fas fa-utensils',         title: 'Local Zayaka',        description: 'Dine at famous local corners and get a flat 25% off.',                     modal: 'modal-food' },
  { icon: 'fas fa-suitcase-rolling', title: 'Tourism Packages',    description: 'All-inclusive: Stay, Food, and Guide sorted.',                            modal: 'modal-packages' },
  { icon: 'fas fa-id-card',          title: 'Register as a Guide', description: 'Become a local guide and help travelers discover authentic experiences.',  modal: 'modal-register-guide' },
  { icon: 'fas fa-map-marked-alt',   title: 'About the Place',     description: 'Discover the history, culture, attractions, and hidden gems of this place.', modal: 'modal-place' },
]

export default function ServicesSection({ attraction, onBack, onOpenModal }: ServicesSectionProps) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [attraction])

  return (
    <section
      id="step-3-services"
      className="bg-cream min-h-screen pt-[120px] pb-[60px]"
    >
      {/* Back button */}
      <button
        id="back-to-attractions-btn"
        onClick={onBack}
        className="bg-transparent border-none text-navy text-base font-bold cursor-pointer mb-6 ml-6 md:ml-12 flex items-center gap-2 hover:opacity-70 transition-opacity duration-200"
      >
        <i className="fas fa-arrow-left" />
        Back to Attractions
      </button>

      <h2 className="font-heading text-center text-[2.5rem] text-navy mb-2">
        Explore {attraction}
      </h2>
      <p className="text-center text-[#555] mb-10">
        Choose a service to enhance your experience.
      </p>

      {/* Services grid */}
      <div
        className="grid gap-[30px] max-w-[1200px] mx-auto mb-[30px] px-6 md:px-12"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {SERVICES.map(svc => (
          <ServiceCard
            key={svc.modal}
            icon={svc.icon}
            title={svc.title}
            description={svc.description}
            onClick={() => onOpenModal(svc.modal)}
          />
        ))}
      </div>
    </section>
  )
}
