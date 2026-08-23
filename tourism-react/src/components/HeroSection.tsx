import { useState } from 'react'
import type { CityKey } from '../types'
import { CITY_NAMES } from '../data/attractions'

interface HeroSectionProps {
  onCitySelect: (city: CityKey) => void
}

export default function HeroSection({ onCitySelect }: HeroSectionProps) {
  const [selectedCity, setSelectedCity] = useState<CityKey | ''>('')
  const [error, setError] = useState('')

  const handleExplore = () => {
    if (!selectedCity) {
      setError('Please select a city first!')
      return
    }
    setError('')
    onCitySelect(selectedCity)
  }

  return (
    <section
      id="step-1-city"
      className="hero-bg min-h-screen flex items-center justify-center pt-20"
    >
      <div className="text-cream text-center px-6 w-full">
        <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] mb-5 leading-tight">
          Where do you want to go?
        </h1>
        <p className="text-[1.1rem] mb-10 opacity-90">
          Select a city to discover its iconic attractions and exclusive services.
        </p>

        <div className="flex gap-3 justify-center items-center flex-wrap">
          <select
            id="city-select"
            value={selectedCity}
            onChange={e => { setSelectedCity(e.target.value as CityKey); setError('') }}
            className="px-4 py-[15px] text-base rounded-md border-none w-[280px] text-navy outline-none cursor-pointer bg-white"
          >
            <option value="" disabled>Select a City...</option>
            {(Object.keys(CITY_NAMES) as CityKey[]).map(key => (
              <option key={key} value={key}>{CITY_NAMES[key]}</option>
            ))}
          </select>

          <button
            id="explore-city-btn"
            type="button"
            onClick={handleExplore}
            className="bg-accent text-navy px-8 py-[15px] border-none rounded-md font-bold cursor-pointer text-base transition-colors duration-200 hover:bg-cream"
          >
            Explore City
          </button>
        </div>

        {error && (
          <p className="mt-3 text-red-300 text-sm font-medium">{error}</p>
        )}
      </div>
    </section>
  )
}
