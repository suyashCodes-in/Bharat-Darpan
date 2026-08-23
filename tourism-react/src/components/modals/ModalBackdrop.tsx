import { useEffect } from 'react'
import type { ModalId } from '../../types'
import GuideModal         from './GuideModal'
import HotelModal         from './HotelModal'
import FoodModal          from './FoodModal'
import PackagesModal      from './PackagesModal'
import RegisterGuideModal from './RegisterGuideModal'
import PlaceModal         from './PlaceModal'

interface ModalBackdropProps {
  activeModal: ModalId | null
  onClose: () => void
}

// Render function — called on each render so every modal mounts fresh,
// which ensures stateful modals (e.g. FoodModal's coupon) reset on re-open.
function renderModal(id: ModalId): React.ReactNode {
  switch (id) {
    case 'modal-guide':          return <GuideModal />
    case 'modal-hotel':          return <HotelModal />
    case 'modal-food':           return <FoodModal />
    case 'modal-packages':       return <PackagesModal />
    case 'modal-register-guide': return <RegisterGuideModal />
    case 'modal-place':          return <PlaceModal />
  }
}

export default function ModalBackdrop({ activeModal, onClose }: ModalBackdropProps) {
  // Body scroll lock
  useEffect(() => {
    if (!activeModal) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [activeModal])

  // Escape key
  useEffect(() => {
    if (!activeModal) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [activeModal, onClose])

  if (!activeModal) return null

  return (
    <>
      {/* Backdrop */}
      <div
        id="modal-overlay"
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1001,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1002,
          backgroundColor: '#F3E4C9',
          padding: '40px',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '2px solid #0A2947',
          animation: 'slideUp 0.25s ease',
        }}
      >
        {/* Close button */}
        <button
          id="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute', top: '15px', right: '20px',
            fontSize: '1.5rem', cursor: 'pointer',
            background: 'none', border: 'none', color: '#0A2947',
            lineHeight: 1,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
          onMouseLeave={e => (e.currentTarget.style.color = '#0A2947')}
        >
          &times;
        </button>

        {renderModal(activeModal)}
      </div>
    </>
  )
}
