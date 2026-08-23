import type { CityKey } from '../types'
import { ATTRACTIONS_DATA, CITY_NAMES } from '../data/attractions'
import AttractionCard from './AttractionCard'

interface AttractionsSectionProps {
  city: CityKey
  onAttractionSelect: (name: string) => void
  onBack: () => void
}

export default function AttractionsSection({ city, onAttractionSelect, onBack }: AttractionsSectionProps) {
  const attractions = ATTRACTIONS_DATA[city]

  // Scroll to top on mount — replaces vanilla's scrollIntoView
  const handleRef = (node: HTMLElement | null) => {
    if (node) requestAnimationFrame(() => node.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <section
      id="step-2-attractions"
      ref={handleRef as React.RefCallback<HTMLElement>}
      className="bg-navy min-h-screen pt-[120px] pb-[60px] px-6 md:px-12"
    >
      {/* Back button */}
      <button
        id="back-to-cities-btn"
        onClick={onBack}
        className="bg-transparent border-none text-cream text-base font-bold cursor-pointer mb-6 flex items-center gap-2 opacity-100 hover:opacity-70 transition-opacity duration-200"
      >
        <i className="fas fa-arrow-left" />
        &nbsp;Back to Cities
      </button>

      <h2 className="font-heading text-center text-[2.5rem] text-cream mb-2">
        Attractions in {CITY_NAMES[city]}
      </h2>

      {/* Card grid */}
      <div className="grid gap-[30px] mt-8 mx-auto max-w-[1200px]"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {attractions.map(attraction => (
          <AttractionCard
            key={attraction.name}
            name={attraction.name}
            img={attraction.img}
            onClick={() => onAttractionSelect(attraction.name)}
          />
        ))}
      </div>
    </section>
  )
}
