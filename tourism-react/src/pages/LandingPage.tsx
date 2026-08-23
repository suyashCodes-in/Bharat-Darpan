import { useReducer, useEffect } from 'react'
import type { LandingState, LandingAction, CityKey, ModalId } from '../types'
import Navbar              from '../components/Navbar'
import HeroSection         from '../components/HeroSection'
import WelcomeSection      from '../components/WelcomeSection'
import AttractionsSection  from '../components/AttractionsSection'
import ServicesSection     from '../components/ServicesSection'
import ModalBackdrop       from '../components/modals/ModalBackdrop'
import Footer              from '../components/Footer'

// ── Reducer ────────────────────────────────────────────────────────
const initialState: LandingState = {
  step: 'city',
  selectedCity: null,
  selectedAttraction: null,
  activeModal: null,
}

function reducer(state: LandingState, action: LandingAction): LandingState {
  switch (action.type) {
    case 'SELECT_CITY':
      return { ...state, step: 'attractions', selectedCity: action.city, selectedAttraction: null, activeModal: null }
    case 'SELECT_ATTRACTION':
      return { ...state, step: 'services', selectedAttraction: action.name, activeModal: null }
    case 'OPEN_MODAL':
      return { ...state, activeModal: action.modal }
    case 'CLOSE_MODAL':
      return { ...state, activeModal: null }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

// ── Component ──────────────────────────────────────────────────────
export default function LandingPage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { step, selectedCity, selectedAttraction, activeModal } = state

  // ── Scroll to top when user resets to city step ────────────────
  useEffect(() => {
    if (step === 'city') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [step])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onReset={() => dispatch({ type: 'RESET' })} />

      {/* Step 1: Hero / City Select */}
      {step === 'city' && (
        <>
          <HeroSection
            onCitySelect={(city: CityKey) => dispatch({ type: 'SELECT_CITY', city })}
          />
          <WelcomeSection />
        </>
      )}

      {/* Step 2: Attractions */}
      {step === 'attractions' && selectedCity && (
        <AttractionsSection
          city={selectedCity}
          onAttractionSelect={(name: string) => dispatch({ type: 'SELECT_ATTRACTION', name })}
          onBack={() => dispatch({ type: 'RESET' })}
        />
      )}

      {/* Step 3: Services */}
      {step === 'services' && selectedAttraction && (
        <ServicesSection
          attraction={selectedAttraction}
          onBack={() => dispatch({ type: 'SELECT_CITY', city: selectedCity! })}
          onOpenModal={(modal: ModalId) => dispatch({ type: 'OPEN_MODAL', modal })}
        />
      )}

      {/* Modals */}
      <ModalBackdrop
        activeModal={activeModal}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      />

      <Footer />
    </div>
  )
}
